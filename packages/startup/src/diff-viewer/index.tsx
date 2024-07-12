import React, { useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';
import anycode from '@codeblitzjs/ide-core/extensions/codeblitz.anycode';
import anycodeCSharp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-c-sharp';
import anycodeCpp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-cpp';
import anycodeGo from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-go';
import anycodeJava from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-java';
import anycodePhp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-php';
import anycodePython from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-python';
import anycodeRust from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-rust';
import anycodeTypescript from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-typescript';
import css from '@codeblitzjs/ide-core/extensions/codeblitz.css-language-features-worker';
import emmet from '@codeblitzjs/ide-core/extensions/codeblitz.emmet';
import html from '@codeblitzjs/ide-core/extensions/codeblitz.html-language-features-worker';
import imagePreview from '@codeblitzjs/ide-core/extensions/codeblitz.image-preview';
import json from '@codeblitzjs/ide-core/extensions/codeblitz.json-language-features-worker';
import markdown from '@codeblitzjs/ide-core/extensions/codeblitz.markdown-language-features-worker';
import referencesView from '@codeblitzjs/ide-core/extensions/codeblitz.references-view';
import typescript from '@codeblitzjs/ide-core/extensions/codeblitz.typescript-language-features-worker';
import { IPartialEditEvent } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.decoration';

import { LocalExtensionModule } from '../common/local-extension.module';
import * as Plugin from '../editor/plugin';
import 'antd/lib/message/style/index.css';
import '../index.css';
import { DiffViewerRenderer } from '@codeblitzjs/ide-core/lib/api/renderDiffViewer';
import { IDiffViewerHandle } from '@codeblitzjs/ide-core/lib/core/diff-viewer';

const extensionMetadata = [
  css,
  html,
  json,
  markdown,
  typescript,
  imagePreview,
  referencesView,
  emmet,
  anycodeCSharp,
  anycodeCpp,
  anycodeGo,
  anycodeJava,
  anycodePhp,
  anycodePython,
  anycodeRust,
  anycodeTypescript,
  anycode,
];

const App = () => {
  const [ready, setReady] = React.useState(false);
  const handleRef = useRef<IDiffViewerHandle | null>(null);

  const [eventInfo, setEventInfo] = React.useState<IPartialEditEvent | null>(null);

  const memo = useMemo(() => (
    <DiffViewerRenderer
      onRef={(handle) => {
        handleRef.current = handle;
        console.log('=====', handle);
        setReady(true);
        handle.onPartialEditEvent((e) => {
          console.log('onPartialEditEvent', e);
          setEventInfo(e);
        });
      }}
      onLoad={(app) => {
        console.log('app', app);
      }}
      appConfig={{
        plugins: [Plugin],
        modules: [
          LocalExtensionModule,
        ],
        extensionMetadata,
      }}
    />
  ), []);

  const header = useMemo(() => (
    <div
      style={{
        height: 'fit-content',
        width: '30vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {ready ? 'ready' : 'not ready'}
      <button
        onClick={() => {
          if (!handleRef.current) return;
          handleRef.current.openDiffInTab(
            'a/web/controller/invalidanalysis/InValidAssetsController.java',
            `
词句注释
⑴满江红：词牌名，又名“上江虹”“念良游”“伤春曲”等。双调九十三字。
⑵怒发（fà）冲冠：气得头发竖起，以至于将帽子顶起，形容愤怒至极。
⑶凭阑：身倚栏杆。阑，同“栏”。
⑷潇潇：形容雨势急骤。
⑸长啸：大声呼叫。啸，蹙口发出声音。
⑹壮怀：奋发图强的志向。
⑺“三十”句：谓自己年已三十，得到的功名如同尘土一样微不足道。三十，是概数。功名，或指岳飞攻克襄阳六郡以后建节晋升之事。
⑻“八千”句：形容南征北战，路途遥远，披星戴月。八千，是概数，极言沙场征战行程之远。
⑼等闲：轻易，随便。
⑽空悲切：即白白地哀痛。
⑾靖康耻：宋钦宗靖康二年（1127），金兵攻陷汴京，虏走徽、钦二帝。靖康，宋钦宗赵桓的年号。
⑿贺兰山：贺兰山脉，中国境内有两座山脉名贺兰山，一座在河北一座在宁夏。一说指位于宁夏与内蒙古交界处的贺兰山，当时被金兵占领；一说指位于河北境内的贺兰山。据史料考证岳飞足迹未到过宁夏贺兰山，而岳飞抗金活动区域曾在河北贺兰山。 [21]
⒀胡虏：对女真族入侵者的蔑称。
⒁匈奴：古代北方民族之一，这里指金入侵者。
⒂朝天阙（què）：朝见皇帝。天阙，本指宫殿前的楼观，此指皇帝居住的地方。明代王熙书《满江红》词碑作“朝金阙”。 [3-4]
白话译文
我怒发冲冠登高倚栏杆，一场潇潇急雨刚刚停歇。抬头放眼四望辽阔一片，仰天长声啸叹，壮怀激烈。三十年勋业如今成尘土，征战千里只有浮云明月。莫虚度年华白了少年头，只有独自悔恨悲悲切切。
靖康年的奇耻尚未洗雪，臣子愤恨何时才能泯灭。我只想驾御着一辆辆战车踏破贺兰山敌人营垒。壮志同仇饿吃敌军的肉，笑谈蔑敌渴饮敌军的血。我要从头彻底地收复旧日河山，再回京阙向皇帝报捷。 [5]
  
  `,
            `
词句注释
⑴满江红：词牌名，又名“上江虹”“念良游”“伤春曲”等。双调九十三字。
⑵怒发（fà）冲冠：气得头发竖起，以至于将帽子顶起，形容愤怒至极。
⑶凭阑：身倚栏杆。阑，同“栏”。
⑷潇潇：形容雨势急骤。
⑸长啸：大声呼叫。啸，蹙口发出声音。
⑹壮怀：奋发图强的志向。
⑻“八千”句：形容南征北战，路途遥远，披星戴月。八千，是概数，极言沙场征战行程之远。
⑼等闲：轻易，随便。
sad
⑽空悲切：即白白地哀痛。
⑾靖康耻：宋钦宗靖康二年（1127），金兵攻陷汴京，虏走徽、钦二帝。靖康，宋钦宗赵桓的年号。
⑿贺兰山：贺兰山脉，中国境内有两座山脉名贺兰山，一座在河北一座在宁夏。一说指位于宁夏与内蒙古交界处的贺兰山，当时被金兵占领；一说指位于河北境内的贺兰山。据史料考证岳飞足迹未到过宁夏贺兰山，而岳飞抗金活动区域曾在河北贺兰山。 [21]
⒀胡虏：对女真族入侵者的蔑称。
⒁匈奴：古代北方民族之一，这里指金入侵者。
⒂朝天阙（què）：朝见皇帝。天阙，本指宫殿前的楼观，此指皇帝居住的地方。明代王熙书《满江红》词碑作“朝金阙”。 [3-4]
我怒发冲冠登高倚栏杆，一场潇潇急雨刚刚停歇。抬头放眼四望辽阔一片，仰天长声啸叹，壮怀激烈。三十年勋业如今成尘土，征战千里只有浮云明月。莫虚度年华白了少年头，只有独自悔恨悲悲切切。
靖康年的奇耻尚未洗雪，臣子愤恨何时才能泯灭。我只想驾御着一辆辆战车踏破贺兰山敌人营垒。壮志同仇饿吃敌军的肉，笑谈蔑敌渴饮敌军的血。我要从头彻底地收复旧日河山，再回京阙向皇帝报捷。 [5]
    `,
          );
        }}
      >
        文件1
      </button>
      <button
        onClick={() => {
          if (!handleRef.current) return;
          handleRef.current.openDiffInTab(
            'test2.txt',
            `
词句注释
⑴满江红：词牌名，又名“上江虹”“念良游”“伤春曲”等。双调九十三字。
            `,
            `
词句注释
⑷潇潇：形容雨势急骤。
⑸长啸：大声呼叫。啸，蹙口发出声音。
⑹壮怀：奋发图强的志向。
⑻“八千”句：形容南征北战，路途遥远，披星戴月。八千，是概数，极言沙场征战行程之远。
              `,
          );
        }}
      >
        文件2
      </button>

      <button
        onClick={() => {
          if (!handleRef.current) return;
          handleRef.current.acceptAllPartialEdit();
        }}
      >
        accept all
      </button>
      <button
        onClick={() => {
          if (!handleRef.current) return;
          handleRef.current.rejectAllPartialEdit();
        }}
      >
        reject all
      </button>
      <p>
        {eventInfo ? JSON.stringify(eventInfo, null, 2) : 'no event'}
      </p>
    </div>
  ), [ready, eventInfo]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
      }}
    >
      {header}
      <div
        style={{
          overflow: 'scroll',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            height: 300,
            backgroundColor: 'salmon',
          }}
        >
          height: 300px
        </div>
        {memo}
        <div
          style={{
            height: 300,
            backgroundColor: 'seagreen',
          }}
        >
          height: 200px
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('main') as HTMLElement);

const render = () => root.render(<App />);
render();
window.reset = (destroy = false) => (destroy ? root.render(<div>destroyed</div>) : render());
