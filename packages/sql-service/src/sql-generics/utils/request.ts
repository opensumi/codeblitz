import { CompletionProviderOptions, SQLType } from '../../types';

/** 自动补全参数转换 */
function transformOptions(options: CompletionProviderOptions) {
  const final = {} as any;
  // if (options.query) {
  //   if (options.query.url === 'mock') {
  //     /** Demos场景下，提供mock数据*/
  //     final.request = () =>
  //       Promise.resolve({
  //         data: {
  //           allEntities: true,
  //           entities: [
  //             {
  //               name: 'sampleOne',
  //               des: '样例数据，补充前缀场景',
  //               parentEntityName: 'prefix_will_be_insert',
  //               type: 'SAMPLE_TYPE_ONE',
  //             },
  //             {
  //               name: 'sampleTwo',
  //               des: '样例数据，无前缀场景',
  //               parentEntityName: 'prefix_will_not_be_insert',
  //               type: 'SAMPLE_TYPE_TWO',
  //             },
  //           ],
  //         },
  //       });
  //   } else {
  //     let completeUrl = `${options.query.url}?`;
  //     Object.entries(options.query.params).forEach(([key, value]) => {
  //       completeUrl += `${key}=${value}&`;
  //     });

  //     final.request = (keyword, sqlType: SQLType = SQLType.DQL) => {
  //       return fetch(
  //         `${completeUrl}keyword=${encodeURIComponent(keyword || '')}&sqlType=${sqlType}`,
  //         {
  //           credentials: 'include',
  //         },
  //       )
  //         .then(data => data.json())
  //         .catch(err => console.error(err));
  //     };
  //   }
  // }

  return final;
}

export { transformOptions };
