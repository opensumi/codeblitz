// @ts-nocheck

/**
 * 计算最小string edit distance
 * 1. 词典的生成逻辑
 * 2. 词典查找逻辑
 */
export enum MODES { TOP, SMALLEST, ALL }

// import * as fs from 'fs';

class DictionaryItem {
  suggestions: Array<number> = [];
  count: number = 0;

  clear(): void{
    this.suggestions = [];
    this.count = 0;
  }

}

class SuggestItem {
  term: string = '';
  distance: number = 0;
  count: number = 0;
}

interface OptionsObj {
  mode?: MODES,
  verbose?: number,
  editDistanceMax?: number
  debug?: boolean
}

export class SymSpell {

  //Dictionary that contains both the original words and the deletes derived from them
  dictionary: Object = {};

  //List of unique words.
  wordList: Array<string> = [];

  //maximum dictionary term length
  maxLength: number = 0;

  options: OptionsObj = {
    mode:MODES.TOP,
    verbose: 2,
    editDistanceMax: 2,
    debug: true
  };

  constructor(options?: OptionsObj, external?: Object) {
    if(options) {
      for(let key in options){
        this.options[key] = options[key];
      }
    }

    if(external) {
      for(let key in external){
        this[key] = external[key];
      }
    }
  }

  parseWords(text: string): Array<any> {
    return text.toLowerCase().match(/([\w\d_](-[\w\d_])?('(t|d|s|m|ll|re|ve))?)+/g);
  }

  createDictionaryEntry(key:string,language:string): boolean{
    var result: boolean = false;
    var value: DictionaryItem;

    var dictKey:string = language + key;
    var valueo: any = dictKey in this.dictionary ? this.dictionary[dictKey] : false;

    if (valueo !== false) {
      if(typeof valueo === 'number'){
        var tmp: number = valueo;
        value = new DictionaryItem();
        value.suggestions.push(tmp);
        this.dictionary[dictKey] = value;
      } else {
        value = valueo;
      }

      if (value.count < Number.MAX_VALUE) value.count++;

    } else if (this.wordList.length < Number.MAX_VALUE) {
      value = new DictionaryItem();
      value.count++;
      this.dictionary[dictKey] = value;
      if (key.length > this.maxLength) this.maxLength = key.length;
    }

    if(value.count === 1){

      var keyInt: number = this.wordList.length;
      this.wordList.push(key);

      result = true;

      //returns object where key and value == each delete
      var edits = this.edits(key, 0);

      for(let delItem in edits) {
        let delKey: string = language + delItem;
        let value2: any = delKey in this.dictionary ? this.dictionary[delKey] : false;
        if (value2 !== false) {
          if (typeof value2 === 'number') {
            let tmp: number = value2;
            let di: DictionaryItem = new DictionaryItem();
            di.suggestions.push(tmp);
            this.dictionary[delKey] = di;

            //if suggestions does not contain keyInt
            if (di.suggestions.indexOf(keyInt) === -1) {
              this.addLowestDistance(di, key, keyInt, delItem);
            }
            //if value2 does not contain keyInt
          } else if (value2.suggestions.indexOf(value2.suggestions.indexOf(keyInt) === -1)) {
            this.addLowestDistance(value2, key, keyInt, delItem);
          }
        }else{
          this.dictionary[delKey] = keyInt;
        }

      }
    }

    const content = `
      export const dictionary = ${JSON.stringify(this.dictionary)};
      export const wordList = ${JSON.stringify(this.wordList)};
      export const maxLength = ${this.maxLength};
    `

    // fs.writeFileSync('src/tools/autofix/dictionary.ts', content);
    return result;
  }

  createDictionary(corpus: string, language: string): void {

    var wordCount: number = 0;

    if (this.options.debug) {
      console.log('Creating dictionary...');
      var tStart: number = Date.now();
    }

    var words = this.parseWords(corpus);
    var self = this;
    words.forEach(function(word) {
      if(self.createDictionaryEntry(word, language)) {
        wordCount++;
      }
    });

    if (this.options.debug) {
      var tEnd: number = Date.now();
      var tDiff: number = tEnd - tStart;

      console.log(`Dictionary: ${wordCount} words, ${Object.keys(this.dictionary).length} entries, edit distance=${this.options.editDistanceMax} in ${tDiff} ms`);
      console.log('memory:', process.memoryUsage());
      console.log('wordlist', this.wordList);
    }
  }

  addLowestDistance(item: DictionaryItem, suggestion:string, suggestionInt:number, delItem:string): void{
    //remove all existing suggestions of higher distance, if verbose<2
    //index2word
    if (
      this.options.verbose < 2 &&
      item.suggestions.length > 0 &&
      this.wordList[item.suggestions[0]].length - delItem.length > suggestion.length - delItem.length
    ) {
      item.clear();
    }
    //do not add suggestion of higher distance than existing, if verbose<2
    if (this.options.verbose == 2 ||
      item.suggestions.length == 0 ||
      this.wordList[item.suggestions[0]].length - delItem.length >= suggestion.length - delItem.length
    ){
      item.suggestions.push(suggestionInt);
    }
  }

  //inexpensive and language independent: only deletes, no transposes + replaces + inserts
  //replaces and inserts are expensive and language dependent (Chinese has 70,000 Unicode Han characters)
  //C# returned HashSet<string>
  //TS returns object with key and value == each delete
  edits(word: string, editDistance: number, deletes?: Object) {
    deletes = deletes || {};
    editDistance++;
    if(word.length > 1 ) {
      for (let i = 0; i < word.length; i++) {
        //emulate C#'s word.Remove(i, 1)
        let delItem: string = word.substring(0, i) + word.substring(i + 1);

        if (!(delItem in deletes)) {
          deletes[delItem] = delItem;
          if(editDistance < this.options.editDistanceMax) {
            this.edits(delItem, editDistance, deletes);
          }
        }

      }
    }
    return deletes;
  }

  lookup(input: string, language: string, editDistanceMax: number): Array<SuggestItem> {
    if (input.length - editDistanceMax > this.maxLength) {
      return [new SuggestItem()];
    }

    var candidates: Array<string> = [];
    var obj1 = {};

    var suggestions: Array<SuggestItem> = [];
    var obj2 = {};

    candidates.push(input);

    while(candidates.length > 0) {
      var candidate: string = candidates.shift();

      //save some time
      //early termination
      //suggestion distance=candidate.distance... candidate.distance+editDistanceMax
      //if canddate distance is already higher than suggestion distance, than there are no better suggestions to be expected
      if (
        this.options.verbose < 2 &&
        suggestions.length > 0 &&
        input.length - candidate.length > suggestions[0].distance
      ){
        break;
        //goto sort
      }

      var dictKey: string = language + candidate;
      var valueo: any = dictKey in this.dictionary ? this.dictionary[dictKey] : false;
      if (valueo !== false) {
        var value: DictionaryItem = new DictionaryItem();

        if (typeof valueo === 'number') {
          value.suggestions.push(valueo);
        } else {
          value = valueo;
        }

        //if count>0 then candidate entry is correct dictionary term, not only delete item
        if (value.count > 0 && !(candidate in obj2)) {
          obj2[candidate] = candidate;
          var si: SuggestItem = new SuggestItem();
          si.term = candidate;
          si.count = value.count;
          si.distance = input.length - candidate.length;
          suggestions.push(si);
          //early termination
          if (
            this.options.verbose < 2 &&
            input.length - candidate.length == 0
          ){
            break;
            //goto sort
          }
        }

        //iterate through suggestions (to other correct dictionary items) of delete item and add them to suggestion list
        var self = this;
        value.suggestions.forEach(function(intItem){
          var suggestion: string = self.wordList[intItem];
          if (!(suggestion in obj2)) {
            obj2[suggestion] = suggestion;
            //True Damerau-Levenshtein Edit Distance: adjust distance, if both distances>0
            //We allow simultaneous edits (deletes) of editDistanceMax on on both the dictionary and the input term.
            //For replaces and adjacent transposes the resulting edit distance stays <= editDistanceMax.
            //For inserts and deletes the resulting edit distance might exceed editDistanceMax.
            //To prevent suggestions of a higher edit distance, we need to calculate the resulting edit distance, if there are simultaneous edits on both sides.
            //Example: (bank==bnak and bank==bink, but bank!=kanb and bank!=xban and bank!=baxn for editDistanceMaxe=1)
            //Two deletes on each side of a pair makes them all equal, but the first two pairs have edit distance=1, the others edit distance=2.
            var distance: number = 0;
            if(suggestion != input){
              if(suggestion.length === candidate.length){
                distance = input.length - candidate.length;
              } else if (input.length === candidate.length){
                distance = suggestion.length - candidate.length;
              } else {
                //common prefixes and suffixes are ignored, because this speeds up the Damerau-levenshtein-Distance calculation without changing it.
                var ii:number = 0;
                var jj:number = 0;
                while (ii < suggestion.length && ii < input.length && suggestion[ii] == input[ii]) ii++;
                while (jj < suggestion.length - ii && jj < input.length - ii && suggestion[suggestion.length - jj - 1] == input[input.length - jj - 1]) jj++;
                if (ii > 0 || jj > 0) {
                  //c# substring = substr in js
                  distance = self.damerauLevenshteinDistance(suggestion.substr(ii, suggestion.length - ii - jj), input.substr(ii, input.length - ii - jj));
                } else {
                  distance = self.damerauLevenshteinDistance(suggestion, input);
                }
              }
            }


            //save some time.
            //remove all existing suggestions of higher distance, if verbose<2
            if (self.options.verbose < 2 && suggestions.length > 0 && suggestions[0].distance > distance) {
              suggestions = [];
            }
            //do not process higher distances than those already found, if verbose<2
            if (self.options.verbose < 2 && suggestions.length > 0 && distance > suggestions[0].distance) {
              return;
              //continue; for forEach
            }

            if (distance <= editDistanceMax) {
              var dictKey2 = language + suggestion;
              var value2: any = dictKey2 in self.dictionary ? self.dictionary[dictKey2] : false;
              if (value2 !== false) {
                var si: SuggestItem = new SuggestItem();
                si.term = suggestion;
                si.count = value2.count;
                si.distance = distance;
                suggestions.push(si);
              }
            }

          }
        }); //end forEach
      } //end if -- valueo

      //add edits
      //derive edits (deletes) from candidate (input) and add them to candidates list
      //this is a recursive process until the maximum edit distance has been reached
      if (input.length - candidate.length < editDistanceMax) {
        //save some time
        //do not create edits with edit distance smaller than suggestions already found
        if (this.options.verbose < 2 && suggestions.length > 0 && input.length - candidate.length >= suggestions[0].distance){
          continue;
        }

        for (var i = 0; i < candidate.length; i++) {
          //emulate C#'s word.Remove(i, 1)
          let delItem: string = candidate.substring(0, i) + candidate.substring(i + 1);
          // var delItem: string = candidate.Remove(i, 1);
          if (!(delItem in obj1)){
            obj1[delItem] = delItem;
            candidates.push(delItem);
          }
        }
      }

    } //end while

    //sort by ascending edit distance, then by descending word frequency
    //sort:
    if (this.options.verbose < 2){
      suggestions = suggestions.sort(function(x, y) {
        //-x.count.CompareTo(y.count)
        return y.count - x.count;
      });
    }else{
      suggestions = suggestions.sort(function(x, y) {
        // 2 * x.distance.CompareTo(y.distance) - x.count.CompareTo(y.count)
        return 2 * (x.distance - y.distance) - (x.count - y.count)
      });
    }

    if (this.options.verbose == 0 && suggestions.length > 1) {
      //C#: GetRange
      return suggestions.slice(0, 1);
    } else{
      return suggestions;
    }
  }

  correct(input: string, language: string): Array<SuggestItem> {
    var suggestions: Array<SuggestItem> = [];
    //check in dictionary for existence and frequency; sort by ascending edit distance, then by descending word frequency
    suggestions = this.lookup(input, language, this.options.editDistanceMax);
    return suggestions;
  }


  // Damerau--Levenshtein distance algorithm and code
  // from http://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance (as retrieved in June 2012)
  damerauLevenshteinDistance(source: string, target: string): number{
    var m: number = source.length;
    var n: number = target.length;
    //new Int32[m + 2, n + 2];
    var H: Array<Array<number>> = [];
    var sd = {};

    var INF:number = m + n;

    H[0] = [];
    H[0][0] = INF;

    //init structures
    for (var i = 0; i <= m; i++) {
      if (!H[i + 1]) H[i + 1] = [];
      H[i + 1][1] = i;
      H[i + 1][0] = INF;
      sd[source[i]] = 0;
    }
    for (var j = 0; j <= n; j++) {
      H[1][j + 1] = j;
      H[0][j + 1] = INF;
      sd[target[j]] = 0;
    }

    var concatString: string = source + target;

    for (var i = 1; i <= m; i++) {
      var DB:number = 0;
      for (var j = 1; j <= n; j++) {
        var i1: number = sd[target[j - 1]];
        var j1:number = DB;

        if (source[i - 1] == target[j - 1]) {
          H[i + 1][j + 1] = H[i][j];
          DB = j;
        } else {
          H[i + 1][j + 1] = Math.min(H[i][j], Math.min(H[i + 1][j], H[i][j + 1])) + 1;
        }

        H[i + 1][j + 1] = Math.min(H[i + 1][j + 1], H[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1));
      }

      sd[source[i - 1]] = i;
    }
    return H[m + 1][n + 1];
  }

} //end SymSpell class
