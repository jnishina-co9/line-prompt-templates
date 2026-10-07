/* 「文字なし・8／16種類」と「文字あり・8種類」の選択画面。 */
(() => {
    'use strict';
    const styles = [
        ['photo','実写','実写・フォトリアリスティック。自然な肌や髪の質感。'],
        ['chibi','ちびキャラ','可愛いちびキャラ。大きく丸い顔、大きな優しい目、小さな鼻と口、ほんのり赤い頬、小さな体。なめらかな輪郭線で髪や服の描き込みを減らし、柔らかな色使いの2Dイラストにする。'],
        ['watercolor','水彩','水彩イラスト。柔らかな筆のにじみと淡い色使い。'],
        ['plush','クレイ','手作りの粘土人形のようなクレイ風。丸みのあるデフォルメした顔と小さな体、マットな粘土の質感、やや不揃いな手作りの形。'],
        ['line','シンプル線画','シンプルな色付き線画。太めでなめらか、丸みのある黒い輪郭線。点の目、小さな鼻と口、描き込みを抑えた髪と服。色は少数の平面的な塗りにし、陰影やグラデーションは入れない。'],
        ['3d','3Dアニメ','3Dアニメ風。親しみやすい大きな目、柔らかな立体感、なめらかな質感。']
    ];
    const textStyles = [
        ['くっきり太字（標準）','しっかりした太さで読みやすい、くっきりした太字。'],
        ['まる文字','丸みのある太字。かわいく、やさしい印象。'],
        ['手書き文字','少しラフで読みやすい、太めの手書き文字。親しみや温かさを出す。'],
        ['筆文字','筆の強弱を生かし、読みやすさを保った太い筆文字。力強い印象。']
    ];
    const groups = {
        '挨拶・感謝': ['笑顔で両手を大きく振る','笑顔でお辞儀する','笑顔で両腕を広げて歓迎する','穏やかな笑顔で胸に手を当てる','笑顔でお茶を差し出す','にこやかに手招きする','真剣な顔で敬礼する'],
        '喜び・お祝い': ['満面の笑みで拍手する','笑顔でジャンプしながら両手を上げる','ウインクしながらピースする','笑顔で小さくガッツポーズする','楽しそうに踊る','スマホを見て爆笑する','笑い転げる','笑顔でハイタッチを待つ','笑顔でクラッカーを鳴らす','楽しそうにマイクを持って熱唱する'],
        '了解・自信・応援': ['自信満々の笑顔で親指を立てる','笑顔で指のOKサインを作る','腕組みして得意げに笑う','胸を張って自信満々の顔をする','拳を握って力強く応援する','自信満々で胸を叩く','得意げに親指を自分に向ける','真剣な表情で指差し確認する','真面目な顔でメモを取る','ひらめいた笑顔で指を1本立てる'],
        '驚き・困惑・考える': ['目を見開いて両手を広げて驚く','驚いて飛び上がる','驚いて二度見する','困り顔で頭をかく','頬に手を当てて考える','ぐるぐる目で混乱する','驚いて自分の頬をつねる','疑問顔でひょこっと顔を出す','真剣な顔で電話のジェスチャーをする'],
        '謝罪・お願い・焦り': ['申し訳なさそうに深く頭を下げる','泣きながら土下座する','困り顔で手を合わせてお願いする','目を閉じて両手を合わせて祈る','時計を見て焦る（文字盤の文字は描かない）','大量の汗をかいて焦りながら走る','頭を抱えてパニックになる','気まずそうにこそこそ逃げる','困り顔で白旗を振る'],
        '悲しみ・怒り': ['大量の涙を流して号泣する','天を仰いで絶望する','肩を落としてとぼとぼ歩く','丸くなって落ち込む','頬をふくらませて怒る','顔を真っ赤にして怒る','驚きと落胆で固まる','不満顔で顔の前に両腕のバツを作る','呆れた顔で指をさしてツッコミを入れる'],
        '眠気・休憩': ['コーヒー片手に眠そうな顔をする','安心した顔で布団にくるまる','椅子でぐったりする','疲れた顔で机に突っ伏す','目を閉じて深呼吸する','眠そうに大きく伸びをする','リモコン片手にくつろぐ','気持ちよさそうに大の字で寝転ぶ','満足顔でお腹に手を当てる','ほっとした顔で汗をぬぐう'],
        '愛情・照れ・お茶目': ['笑顔で両手のハートを作る','照れ笑いで指ハートを作る','うるうるした目で見つめる','目をハートにして両手を頬に当てる','顔を覆って照れる','頬を赤らめて微笑む','目を閉じて感動する','いたずらっぽくウインクする','楽しそうに猫のポーズをする','口を閉じて秘密を守る仕草をする','手を口に添えてひそひそ話す','目を輝かせて感激する']
    };
    function createEditor(total, rows, cols, textMode) {
    const withText = textMode === 'with-text';
    const pairLine = pair => `ポーズ：${pair.pose}／セリフ：「${pair.phrase}」`;
    const activeGroups = withText
        ? Object.fromEntries(Object.entries(window.withTextPairs).map(([key, pairs]) => [key, pairs.map(pairLine)]))
        : groups;
    let chosen = 0;
    let currentStyle = styles[0][2];
    let textStyleIndex = 0;
    let currentTextStyle = textStyles[0][1];
    const textStylePrompts = [
        '輪郭がくっきりした均一な線幅の太字。安定した字形で、はっきり読みやすくする。',
        '角や線の端に丸みのある、柔らかな字形のまる文字。かわいく、やさしい印象にする。',
        '人がペンで書いたような自然な線のゆらぎ、不揃いな字形や傾きのある手書き文字。親しみと温かさを表現する。',
        '筆圧による線の強弱、筆の入り・払い・はね、適度なかすれを生かした筆文字。文字を判読できる範囲で勢いを表現する。'
    ];
    const textStyleLine = value => {
        const index = textStyles.findIndex(style => style[1] === value);
        return '- 文字デザイン：' + (index < 0 ? value : textStylePrompts[index]);
    };
    const poses = [];
    let draft = '';
    const styleLine = value => '- 見た目：' + value;
    const poseLine = (i,value) => `${i + 1}. ${value}`;
    function initialPrompt() {
        return `添付画像の人物・キャラクターをもとに、${withText ? 'セリフ入り' : '文字なし'}のLINEスタンプ${total}種類を1枚に生成してください。

## 見た目

${styleLine(styles[chosen][2])}
- 全${total}種類で同じ人物の顔立ち・髪型・服装を保ち、画風・色味・照明を統一する。

## 配置・背景

- 横長16:9のキャンバスに${rows}行×${cols}列で均等に配置。左上から右へ、次に下段へ並べる。
- 各スタンプを各領域の中央に置き、上下左右に十分な余白を確保する。
- 人物・手足・涙・汗${withText ? '・セリフ・演出' : ''}などすべての要素を各領域内に収め、隣と接触させない。
- 背景は全体を完全に均一な単色 #00FF00 にする。背景の影・模様・グラデーション・枠線・仕切り線は描かない。

## ${withText ? 'セリフ・ポーズ' : '表情・ポーズ'}

${Array.from({length:total},(_,i) => poseLine(i,poses[i] || '［未選択］')).join('\n')}

${withText ? `## 文字のデザイン\n\n${textStyleLine(currentTextStyle)}\n- 全スタンプに選択した字体の特徴を適用する。文字色は統一せず、各スタンプの表情・セリフに合わせて変える。背景は全体を完全に均一な単色 #00FF00。\n- 各領域の上下左右に余白を確保し、人物周辺の空きスペースに大きく読みやすく配置する。\n\n` : ''}## 共通ルール

- 表情と動きを分かりやすく表現する。各領域に人物は1人だけ。
- ${withText ? '各スタンプには指定したセリフを一字一句そのまま1つだけ、選択した文字デザインに従い、小さく表示しても読めるように表示する。顔や重要なポーズを隠さず、吹き出しは使わない。セリフ以外の文字・数字・ロゴ・透かしは入れない。キラキラ・後光・星・雨などの演出は各領域内の人物の周りだけに置き、背景色を変えない。' : '文字・セリフ・数字・ロゴ・透かし・吹き出しは一切入れない。'}`;
    }
    const el = (tag, cls, text) => { const n = document.createElement(tag); if(cls)n.className=cls; if(text)n.textContent=text; return n; };
    const build = () => {
        const id = name => withText ? name + (total === 8 ? '' : '-' + total) + '-with-text' : total === 8 ? name : name + '-' + total;
        const card = el('div','card prompt-builder');
        card.append(el('h3','step-title',`${withText ? '文字あり' : '文字なし'} · ${total}種類（${rows}行 × ${cols}列）`));
        card.append(el('h3','step-title','1. 見た目を選ぶ'));
        card.append(el('p','builder-note','画像はタッチの見本です。生成時はご自身の写真・キャラクター画像を添付してください。'));
        const grid = el('div','builder-grid');
        const editor = el('textarea','prompt-text'); editor.id=id('no-text-prompt'); editor.value = draft || initialPrompt(); draft=editor.value;
        editor.addEventListener('input',()=>{draft=editor.value;styleStatus.textContent='';});
        function replaceLine(prefix, value) {
            const lines=editor.value.split('\n');
            const matches=lines.map((line,i)=>line.startsWith(prefix)?i:-1).filter(i=>i>=0);
            if(matches.length!==1) { alert('変更する行を特定できませんでした。手動編集を保護するため、自動反映を見送りました。プロンプト内に「'+prefix+'」で始まる行を1行用意してから、もう一度選択してください。'); return false; }
            const index=matches[0];
            const previous=prefix==='- 文字デザイン：' ? textStyleLine(currentTextStyle) : prefix==='- 見た目：' ? styleLine(currentStyle) : poseLine(Number(prefix.split('.')[0])-1,poses[Number(prefix.split('.')[0])-1]);
            if(lines[index]!==previous && !confirm('この項目は手動編集されています。この行だけ選択内容で置き換えますか？'))return false;
            lines[index]=value; editor.value=lines.join('\n'); draft=editor.value; if(prefix==='- 見た目：')currentStyle=value.slice(prefix.length); return true;
        }
        styles.forEach((s,i)=>{
            const b=el('button','style-choice'); b.type='button'; b.setAttribute('aria-pressed',String(chosen===i));
            const img=el('img'); img.src=`assets/prompt-styles/${s[0]}.png`; img.alt=s[1]+'の上半身見本'; img.width=400; img.height=400;
            b.append(img,el('span','',s[1]));
            b.onclick=()=>{styleStatus.textContent='';chosen=i; custom.value=''; refreshStyles();}; grid.append(b);
        });
        function refreshStyles(){grid.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(chosen===i)));}
        card.append(grid);
        const customLabel=el('label','','選択肢にない見た目を自由に入力できます'); customLabel.htmlFor=id('custom-style');
        const custom=el('input'); custom.id=id('custom-style'); custom.placeholder='例：色鉛筆風、やさしい色合い';
        if(chosen===-1)custom.value=currentStyle;
        const styleStatus=el('span');styleStatus.id=id('style-status');styleStatus.setAttribute('role','status');
        custom.addEventListener('input',()=>{styleStatus.textContent='';});
        const customApply=el('button','copy-btn','この見た目を反映');
        customApply.onclick=()=>{
            styleStatus.textContent='';
            const input=custom.value.trim();
            const value=input || (chosen>=0 ? styles[chosen][2] : '');
            if(value && replaceLine('- 見た目：',styleLine(value))){
                if(input)chosen=-1;
                refreshStyles();styleStatus.textContent='反映しました';
            }
        };
        const styleActions=el('div','builder-actions');styleActions.append(customApply,styleStatus);
        card.append(customLabel,custom,styleActions);
        card.append(el('h3','step-title',withText ? '2. セリフ・ポーズを選ぶ' : '2. 表情・ポーズを選ぶ'),el('p','builder-note',`カテゴリから${total}種類を選んでください。選んだ順に、左上から右へ、次に下段へ配置します。`));
        const categories=el('div','category-grid');
        Object.keys(activeGroups).forEach(key=>{const b=el('button','category-choice',key);b.onclick=()=>openPicker(key);categories.append(b);});
        const count=el('p','builder-note');count.setAttribute('role','status');
        const list=el('ol','selected-poses');
        card.append(categories,count,list);
        function updatePoses(next) {
            const lines=editor.value.split('\n');
            const indices=[];let edited=false;
            for(let i=0;i<total;i++) {
                const prefix=(i+1)+'. ';
                const found=lines.map((line,j)=>line.startsWith(prefix)?j:-1).filter(j=>j>=0);
                if(found.length!==1){alert(`表情・ポーズの行を特定できませんでした。編集内容を保護するため反映を見送りました。1. 〜 ${total}. で始まる行をそれぞれ1行用意してください。`);return false;}
                indices.push(found[0]);
                if((poses[i]||'［未選択］')!==(next[i]||'［未選択］') && lines[found[0]]!==poseLine(i,poses[i]||'［未選択］'))edited=true;
            }
            if(edited&&!confirm('変更対象の表情・ポーズは手動編集されています。対象の行を選択内容で置き換えますか？'))return false;
            indices.forEach((j,i)=>{if((poses[i]||'［未選択］')!==(next[i]||'［未選択］'))lines[j]=poseLine(i,next[i]||'［未選択］');});
            editor.value=lines.join('\n');draft=editor.value;poses.splice(0,poses.length,...next);drawSelected();return true;
        }
        function drawSelected(){
            count.textContent='選択済み '+poses.length+'／'+total+(poses.length===total?'（変更・削除は下の一覧から）':'');
            categories.querySelectorAll('button').forEach(b=>b.disabled=poses.length>=total);
            list.replaceChildren();
            poses.forEach((p,i)=>{
                const item=el('li');item.append(el('span','',p));
                const edit=el('button','','変更');edit.setAttribute('aria-label',(i+1)+'番目を変更');edit.onclick=()=>openPicker(Object.keys(activeGroups).find(k=>activeGroups[k].includes(p))||Object.keys(activeGroups)[0],i);
                const remove=el('button','','削除');remove.setAttribute('aria-label',(i+1)+'番目を削除');remove.onclick=()=>updatePoses(poses.filter((_,j)=>j!==i));
                item.append(edit,remove);list.append(item);
            });
        }
        drawSelected();
        function openPicker(key,index=null){
            const dialog=el('dialog','pose-dialog'); const title=el('h3','',index===null?(withText?'セリフ・ポーズを追加':'表情・ポーズを追加'):(index+1)+'番目の'+(withText?'セリフ・ポーズ':'表情・ポーズ')+'を変更'); title.id='pose-title'; dialog.setAttribute('aria-labelledby','pose-title');
            const category=el('select'); category.id='pose-category'; Object.keys(activeGroups).forEach(k=>{const o=el('option','',k);o.value=k;category.append(o);});category.value=key;
            const catLabel=el('label','','カテゴリ');catLabel.htmlFor=category.id;
            const options=el('div','pose-options');const input=el('textarea'); input.id='pose-custom';input.value=index===null?'':poses[index];
            const inputLabel=el('label','','選んだ内容（自由入力・編集もできます）');inputLabel.htmlFor=input.id;
            let poseInput, phraseInput;
            if (withText) {
                const match=input.value.match(/^ポーズ：(.*)／セリフ：「(.*)」$/);
                poseInput=el('input');poseInput.id='pair-pose';poseInput.value=match ? match[1] : '';
                phraseInput=el('input');phraseInput.id='pair-phrase';phraseInput.value=match ? match[2] : '';
                inputLabel.textContent='選んだ内容（自由入力・編集もできます）';
            }
            function draw(){options.replaceChildren();activeGroups[category.value].forEach(p=>{const b=el('button','',p);b.setAttribute('aria-pressed',String(input.value===p));b.onclick=()=>{input.value=p;if(withText){const pair=p.match(/^ポーズ：(.*)／セリフ：「(.*)」$/);poseInput.value=pair[1];phraseInput.value=pair[2];}draw();};options.append(b);});}
            category.onchange=draw;input.oninput=()=>options.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===input.value)));draw();
            const actions=el('div','builder-actions');const apply=el('button','copy-btn',index===null?'追加する':'変更する');const cancel=el('button','copy-btn','キャンセル');
            apply.onclick=()=>{const v=withText ? pairLine({pose:poseInput.value.trim().replace(/\s*\n\s*/g,' '),phrase:phraseInput.value.trim().replace(/\s*\n\s*/g,' ')}) : input.value.trim().replace(/\s*\n\s*/g,' ');if(withText && !poseInput.value.trim()){poseInput.focus();return;}if(withText && !phraseInput.value.trim()){phraseInput.focus();return;}if(!v){input.focus();return;}const next=[...poses];if(index===null){if(next.length>=total)return;next.push(v);}else next[index]=v;if(updatePoses(next))dialog.close();};
            cancel.onclick=()=>dialog.close();actions.append(apply,cancel);dialog.append(title,catLabel,category,options,inputLabel);if(withText){const poseLabel=el('label','','ポーズ');poseLabel.htmlFor=poseInput.id;const phraseLabel=el('label','','セリフ');phraseLabel.htmlFor=phraseInput.id;dialog.append(poseLabel,poseInput,phraseLabel,phraseInput);}else dialog.append(input);dialog.append(actions);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
        }
        if (withText) {
            card.append(el('h3','step-title','3. 文字のデザインを選ぶ'),el('p','builder-note','選んだ文字デザインを、すべてのスタンプに共通で適用します。'));
            const selectedTextStyle=el('span','',textStyles[textStyleIndex][0]);
            selectedTextStyle.setAttribute('role','status');
            const textCategories=el('div','category-grid');
            textStyles.forEach((style,i)=>{
                const button=el('button','category-choice',style[0]);button.type='button';
                button.setAttribute('aria-haspopup','dialog');
                button.onclick=()=>openTextStyle(i,button);textCategories.append(button);
            });
            card.append(textCategories,selectedTextStyle);
            function openTextStyle(index,trigger){
                const dialog=el('dialog','pose-dialog');
                const title=el('h3','','文字のデザインを変更');title.id=id('text-style-title');dialog.setAttribute('aria-labelledby',title.id);
                const category=el('select');category.id=id('text-style-category');
                textStyles.forEach((style,i)=>{const option=el('option','',style[0]);option.value=String(i);category.append(option);});category.value=String(index);
                const categoryLabel=el('label','','カテゴリ');categoryLabel.htmlFor=category.id;
                const options=el('div','pose-options text-style-options');
                const customLabel=el('label','','選んだ内容（自由入力・編集もできます）');customLabel.htmlFor=id('custom-text-style');
                const custom=el('textarea');custom.id=customLabel.htmlFor;
                custom.value=textStyleIndex===index||textStyleIndex===-1?currentTextStyle:textStyles[index][1];
                function draw(){
                    options.replaceChildren();
                    const style=textStyles[Number(category.value)];
                    const button=el('button','',style[1]);button.type='button';button.setAttribute('aria-pressed',String(custom.value===style[1]));
                    button.onclick=()=>{custom.value=style[1];draw();};options.append(button);
                }
                category.onchange=draw;custom.oninput=draw;draw();
                const actions=el('div','builder-actions');
                const apply=el('button','copy-btn','変更する');apply.type='button';
                const cancel=el('button','copy-btn','キャンセル');cancel.type='button';
                apply.onclick=()=>{
                    const value=custom.value.trim().replace(/\s*\n\s*/g,' ');
                    if(!value){custom.focus();return;}
                    if(!replaceLine('- 文字デザイン：',textStyleLine(value)))return;
                    textStyleIndex=textStyles.findIndex(style=>style[1]===value);currentTextStyle=value;
                    selectedTextStyle.textContent=textStyleIndex===-1?'自由入力：'+value:textStyles[textStyleIndex][0];
                    dialog.close();
                };
                cancel.onclick=()=>dialog.close();actions.append(apply,cancel);dialog.append(title,categoryLabel,category,options,customLabel,custom,actions);
                document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();trigger.focus();},{once:true});dialog.showModal();
            };
        }
        const heading=el('h3','step-title',withText ? '4. プロンプトを確認・編集' : '3. プロンプトを確認・編集');heading.id=id('prompt-edit-title');editor.setAttribute('aria-labelledby',heading.id);
        const copy=el('button','copy-btn','プロンプトをコピー');const status=el('span'); status.setAttribute('role','status');
        copy.onclick=async()=>{try{if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(editor.value);}else{editor.focus();editor.select();if(!document.execCommand('copy'))throw Error();}status.textContent='コピーしました';}catch{status.textContent='コピーできませんでした。入力欄を選択して手動でコピーしてください。';}};
        const actions=el('div','builder-actions');actions.append(copy,status);
        card.append(heading,el('p','builder-note','直接編集できます。選択を変えると、その項目の行だけを更新します。'),editor,actions);return card;
    };
    return build();
    }
    const editors = new Map();
    window.buildNoTextPromptEditor = (total = 8, rows = 2, cols = 4, textMode = 'none') => {
        const key = textMode + '-' + total;
        if (!editors.has(key)) editors.set(key, createEditor(total, rows, cols, textMode));
        return editors.get(key);
    };
})();
