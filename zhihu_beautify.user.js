// ==UserScript==
// @name         知乎美化
// @namespace    http://tampermonkey.net/
// @version      2.1.5.2
// @description  1.【重要更新】增加夜间模式按钮     2.知乎题目栏增加举报、匿名、问题日志、快捷键四个按钮     3.知乎按钮图标在鼠标悬停时变色(题目按钮、回答下方按钮、评论按钮等)     4.回答的发布时间移至顶部     5.图片原图显示     6.文字和卡片链接从知乎跳转链接改为直链     7.集成其他脚本的知乎视频下载功能     8.隐藏侧边栏     9.GIF图自动播放【默认不开启】     10.问题增加创建时间和最后编辑时间     11.鼠标悬停在回答时显示浅蓝色聚焦框    12.引用角标高亮    13.首页信息流增加不感兴趣按钮  14.【重要更新】增加设置界面
// @author       AN drew
// @match        *://*.zhihu.com/*
// @match        https://v.vzuu.com/video/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @connect      zhihu.com
// @connect      vzuu.com
// @grant        GM_info
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
 
var hideIndexSidebar;       //隐藏首页侧边栏
var hideQuestionSidebar;    //隐藏回答侧边栏
var hideSearchSideBar;      //隐藏搜索侧边栏
var hideTopicSideBar;       //隐藏话题侧边栏
var hideCollectionSideBar;  //隐藏收藏侧边栏
var hideClubSideBar;        //隐藏圈子侧边栏
var hideDraftSideBar;       //隐藏草稿侧边栏
var hideLaterSideBar;       //隐藏稍后答侧边栏
var hideProfileSidebar;     //隐藏用户主页侧边栏
var hideRecommendedReading; //隐藏专栏推荐阅读
var publishTop;             //置顶回答时间
var GIFAutoPlay;            //GIF自动播放
var hoverShadow;            //悬停时显示浅蓝色边框
var blockingPictureVideo;   //隐藏图片/视频
 
 
//日间模式图标(base64)
var light = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDIC' +
    'ItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjA2NzI5MzM4IiB' +
    'jbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjkxNSIgd2lk' +
    'dGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mY' +
    'WNlIHsgZm9udC1mYW1pbHk6IGVsZW1lbnQtaWNvbnM7IHNyYzogdXJsKCJjaHJvbWUtZXh0ZW5zaW9uOi8vYmJha2hubWZramVuZmJoamRkZGlwY2VmbmhwaWtqYmovZm9udH' +
    'MvZWxlbWVudC1pY29ucy53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL2ZvbnR' +
    'zL2VsZW1lbnQtaWNvbnMudHRmICIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQo8L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyLjEgNzQzLjVjLTEyNy42IDAtMjMxLjQtMTAz' +
    'LjgtMjMxLjQtMjMxLjRzMTAzLjgtMjMxLjQgMjMxLjQtMjMxLjQgMjMxLjQgMTAzLjggMjMxLjQgMjMxLjQtMTAzLjggMjMxLjQtMjMxLjQgMjMxLjR6IG0wLTM5My40Yy04O' +
    'S4zIDAtMTYyIDcyLjctMTYyIDE2MnM3Mi43IDE2MiAxNjIgMTYyIDE2Mi03Mi43IDE2Mi0xNjItNzIuNy0xNjItMTYyLTE2MnpNNTEyLjEgMjI3LjFjLTE5LjIgMC0zNC43LT' +
    'E1LjUtMzQuNy0zNC43Vjk4LjdjMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjcgMTkuMiAwIDM0LjcgMTUuNSAzNC43IDM0Ljd2OTMuN2MwIDE5LjEtMTUuNSAzNC43LTM0Ljc' +
    'gMzQuN3pNMjg2IDMyMC43Yy04LjkgMC0xNy44LTMuNC0yNC41LTEwLjJsLTY2LjMtNjYuM2MtMTMuNi0xMy42LTEzLjYtMzUuNSAwLTQ5LjEgMTMuNS0xMy42IDM1LjUtMTMu' +
    'NiA0OS4xIDBsNjYuMyA2Ni4zYzEzLjYgMTMuNiAxMy42IDM1LjUgMCA0OS4xYTM0LjY4IDM0LjY4IDAgMCAxLTI0LjYgMTAuMnpNMTkyLjQgNTQ2LjhIOTguN2MtMTkuMiAwL' +
    'TM0LjctMTUuNS0zNC43LTM0LjcgMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjdoOTMuN2MxOS4yIDAgMzQuNyAxNS41IDM0LjcgMzQuNyAwIDE5LjEtMTUuNSAzNC43LTM0Lj' +
    'cgMzQuN3pNMjE5LjggODM5LjFjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMi0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMWw2Ni4zLTY2LjNjMTMuNS0xMy42IDM1LjUtMTM' +
    'uNiA0OS4xIDAgMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFsLTY2LjMgNjYuM2MtNi45IDYuOC0xNS43IDEwLjItMjQuNiAxMC4yek01MTIuMSA5NjAuMmMtMTkuMiAwLTM0' +
    'LjctMTUuNS0zNC43LTM0Ljd2LTkzLjdjMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjcgMTkuMiAwIDM0LjcgMTUuNSAzNC43IDM0Ljd2OTMuN2MwIDE5LjItMTUuNSAzNC43L' +
    'TM0LjcgMzQuN3pNODA0LjQgODM5LjFjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMmwtNjYuMy02Ni4zYy0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMSAxMy41LTEzLjYgMz' +
    'UuNS0xMy42IDQ5LjEgMGw2Ni4zIDY2LjNjMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFhMzQuNjggMzQuNjggMCAwIDEtMjQuNiAxMC4yek05MjUuNSA1NDYuOGgtOTMuN2M' +
    'tMTkuMiAwLTM0LjctMTUuNS0zNC43LTM0LjcgMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjdoOTMuN2MxOS4yIDAgMzQuNyAxNS41IDM0LjcgMzQuNyAwIDE5LjEtMTUuNSAz' +
    'NC43LTM0LjcgMzQuN3pNNzM4LjIgMzIwLjdjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMi0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMWw2Ni4zLTY2LjNjMTMuNS0xMy42I' +
    'DM1LjUtMTMuNiA0OS4xIDAgMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFsLTY2LjMgNjYuM2MtNi45IDYuOC0xNS44IDEwLjItMjQuNiAxMC4yeiIgZmlsbD0iI2Y0ZWEyYS' +
    'IgcC1pZD0iOTE2Ij48L3BhdGg+PC9zdmc+';
 
//夜间模式图标(base64)
var dark = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDI' +
    'CItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjAzODE3ODAwI' +
    'iBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExMDEiI' +
    'HhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvb' +
    'nQtZmFjZSB7IGZvbnQtZmFtaWx5OiBlbGVtZW50LWljb25zOyBzcmM6IHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL' +
    '2ZvbnRzL2VsZW1lbnQtaWNvbnMud29mZiIpIGZvcm1hdCgid29mZiIpLCB1cmwoImNocm9tZS1leHRlbnNpb246Ly9iYmFraG5tZmtqZW5mYmhqZGRkaXBjZWZuaHBpa2pia' +
    'i9mb250cy9lbGVtZW50LWljb25zLnR0ZiAiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUwMy40IDk1OS4yYy0xNTYuMSAwLTMwM' +
    'y4xLTgzLjItMzgzLjUtMjE3LjNsLTQ1LjgtNzYuMyA4Ny4yIDE3LjNjNDQgOC44IDg4LjkgOC42IDEzMy4yLTAuNkMzODIuNiA2NjQuNCA0NTguMyA2MTMgNTA3LjggNTM4Y' +
    'zQ5LjUtNzUuMSA2Ni44LTE2NC45IDQ4LjctMjUzLTExLjgtNTcuMy0zOC40LTExMC43LTc2LjktMTU0LjRsLTU4LjctNjYuNyA4OC44IDEuMmMyNDMuMSAzLjQgNDQwLjggM' +
    'jAzLjkgNDQwLjggNDQ3IDAgMjQ2LjUtMjAwLjYgNDQ3LjEtNDQ3LjEgNDQ3LjF6TTIzOC4zIDc2OC4xYzY4LjUgNzEuNCAxNjMgMTEyLjMgMjY1LjEgMTEyLjMgMjAzLjEgM' +
    'CAzNjguMy0xNjUuMiAzNjguMy0zNjguMyAwLTE3MS42LTExOS42LTMxNy40LTI3OS44LTM1Ny40IDE5LjQgMzUuNyAzMy41IDc0LjMgNDEuOCAxMTQuNCA0Ni4xIDIyNC40L' +
    'Tk4LjkgNDQ0LjQtMzIzLjMgNDkwLjUtMjQgNS00OCA3LjgtNzIuMSA4LjV6IiBmaWxsPSIjMDAwMDAwIiBwLWlkPSIxMTAyIj48L3BhdGg+PC9zdmc+';
 
//显示快捷键窗口
var $hint = $('<div>' +
              '   <div>' +
              '    <div>' +
              '     <div class=\"Modal-wrapper Modal-enter-done\">' +
              '      <div class=\"Modal-backdrop\"></div>' +
              '      <div class=\"Modal Modal--default ShortcutHintModal\" tabindex=\"0\">' +
              '       <div class=\"Modal-inner\">' +
              '        <h3 class=\"Modal-title\">快捷键帮助</h3>' +
              '        <div class=\"Modal-content\">' +
              '         <div class=\"ShortcutHintModal-content\">' +
              '          <div class=\"ShortcutHintModal-hintListContainer\">' +
              '           <div class=\"ShortcutHintModal-hintList\">' +
              '            <div class=\"ShortcutHintModal-hintTitle\">' +
              '             操作' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">V</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：赞同' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">D</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：反对' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">L</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：喜欢' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">C</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：展开 / 收起评论' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">Shift</kbd>' +
              '               <div class=\"KeyHint-separator\">' +
              '                +' +
              '               </div>' +
              '              </div>' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">C</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：聚焦到评论框' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">O</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：展开 / 收起全文' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">S</kbd>' +
              '               <div class=\"KeyHint-separator KeyHint-separator--space\"> ' +
              '               </div>' +
              '              </div>' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">C</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：收藏' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">F</kbd>' +
              '               <div class=\"KeyHint-separator KeyHint-separator--space\"> ' +
              '               </div>' +
              '              </div>' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">X</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：分享' +
              '             </div>' +
              '            </div>' +
              '           </div>' +
              '           <div class=\"ShortcutHintModal-hintList\">' +
              '            <div class=\"ShortcutHintModal-hintTitle\">' +
              '             导航' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">J</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：下一项' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">K</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：上一项' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">G</kbd>' +
              '               <div class=\"KeyHint-separator KeyHint-separator--space\"> ' +
              '               </div>' +
              '              </div>' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">G</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：第一项' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">Shift</kbd>' +
              '               <div class=\"KeyHint-separator\">' +
              '                +' +
              '               </div>' +
              '              </div>' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">G</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：最后一项' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">Shift</kbd>' +
              '               <div class=\"KeyHint-separator\">' +
              '                +' +
              '               </div>' +
              '              </div>' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">U</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：向上滚动半屏' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">Shift</kbd>' +
              '               <div class=\"KeyHint-separator\">' +
              '                +' +
              '               </div>' +
              '              </div>' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">D</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：向下滚动半屏' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">/</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：搜索' +
              '             </div>' +
              '            </div>' +
              '            <div class=\"KeyHint\">' +
              '             <div class=\"KeyHint-keyContainer\">' +
              '              <div class=\"KeyHint-key\">' +
              '               <kbd class=\"KeyHint-kbd\">?</kbd>' +
              '              </div>' +
              '             </div>' +
              '             <div>' +
              '              ：快捷键帮助' +
              '             </div>' +
              '            </div>' +
              '           </div>' +
              '          </div>' +
              '         </div>' +
              '        </div>' +
              '       </div>' +
              '       <button aria-label=\"关闭\" type=\"button\" class=\"Button Modal-closeButton Button--plain\">' +
              '        <svg class=\"Zi Zi--Close Modal-closeIcon\" fill=\"currentColor\" viewbox=\"0 0 24 24\" width=\"24\" height=\"24\">' +
              '         <path d=\"M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z\" fill-rule=\"evenodd\"></path>' +
              '        </svg></button>' +
              '      </div>' +
              '     </div>' +
              '    </div>' +
              '   </div>' +
              '</div>');
 
 
//添加"匿名"按钮
function addAnonymous ($QuestionHeaderActions, $more) {
    var a = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\">' +
        '<span style=\"display: inline-flex; align-items: center; vertical-align:middle;\">' +
        '<svg class=\"Zi Zi--Anonymous Button-zi\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" width=\"1.2em\" height=\"1.2em\">' +
        '<path d=\"M831.994 442.66v436.364c0 24.906 7.312 45.124 42.654 45.124 35.344 0 42.656-20.218 42.656-45.124V442.66h-85.31z\"></path>' +
        '<path d=\"M895.992 582.814c0 11.78 9.532 21.342 21.312 21.342v-42.654a21.3 21.3 0 0 0-21.312 21.312zM895.992 668.156c0 11.78 9.532 21.342 21.312 21.342v-42.686c-11.78 0-21.312 9.564-21.312 21.344zM895.992 753.496a21.3 21.3 0 0 0 21.312 21.312v-42.656c-11.78 0-21.312 9.562-21.312 21.344zM895.992 838.806c0 11.812 9.532 21.344 21.312 21.344v-42.654c-11.78 0-21.312 9.562-21.312 21.31zM853.306 582.814c0 11.78-9.532 21.342-21.312 21.342v-42.654a21.3 21.3 0 0 1 21.312 21.312zM853.306 668.156c0 11.78-9.532 21.342-21.312 21.342v-42.686c11.782 0 21.312 9.564 21.312 21.344zM853.306 753.496a21.3 21.3 0 0 1-21.312 21.312v-42.656c11.782 0 21.312 9.562 21.312 21.344zM853.306 838.806c0 11.812-9.532 21.344-21.312 21.344v-42.654c11.782 0 21.312 9.562 21.312 21.31z\"></path><path d=\"M831.994 590.688c26.25-14.124 56.592-34.404 85.31-62.402V442.66h-85.31v148.028z\"></path>' +
        '<path d=\"M1021.52 168.916c-15.532-160.26-413.238 8.594-509.516 8.594S17.986 8.656 2.486 168.916c-29.436 303.68 212.838 396.178 254.65 405.772 147.84 33.904 201.15-48.044 254.868-48.044 53.686 0 107.028 81.95 254.836 48.044 41.812-9.592 284.086-102.092 254.68-405.772zM392.85 399.318c-23.624 8.328-52.154 12.906-80.342 12.906-24.78 0-47.904-3.594-66.904-10.39-18.75-6.718-32.812-16.204-41.842-28.202-14.75-19.67-16.906-48.578-6.436-85.95 2.5-1.156 9.342-3.532 23.592-3.532 36.062 0 88.216 15.03 132.84 38.28 44.75 23.312 66.342 46.624 71.81 59.25-3.97 3.904-13.844 10.982-32.718 17.638z m427.364-25.688c-9 12-23.094 21.484-41.844 28.202-18.968 6.796-42.124 10.39-66.874 10.39-28.218 0-56.748-4.578-80.342-12.906-18.906-6.656-28.75-13.734-32.75-17.64 5.468-12.624 27.062-35.936 71.812-59.25 44.622-23.25 96.778-38.28 132.872-38.28 14.25 0 21.06 2.376 23.56 3.532 10.502 37.376 8.314 66.282-6.434 85.952z\" ></path>' +
        '<path d=\"M867.71 276.15a42.61 42.61 0 0 0-22.998-27.124c-10.718-5-24.716-7.546-41.624-7.546-43.094 0-101.56 16.516-152.59 43.11-46.406 24.186-79.688 53.404-91.248 80.154a42.642 42.642 0 0 0 9.342 47.466c7.532 7.344 22.032 18.062 48.376 27.342 28.032 9.89 61.592 15.344 94.53 15.344 29.592 0 57.716-4.468 81.28-12.89 26.75-9.578 47.436-23.968 61.56-42.764 12.31-16.406 19.404-36.186 21.124-58.764 1.436-19.284-1.158-40.938-7.752-64.328z m-47.496 97.48c-9 12-23.094 21.484-41.844 28.202-18.968 6.796-42.124 10.39-66.874 10.39-28.218 0-56.748-4.578-80.342-12.906-18.906-6.656-28.75-13.734-32.75-17.64 5.468-12.624 27.062-35.936 71.812-59.25 44.622-23.25 96.778-38.28 132.872-38.28 14.25 0 21.06 2.376 23.56 3.532 10.502 37.376 8.314 66.282-6.434 85.952zM464.722 364.742c-11.562-26.75-44.81-55.968-91.248-80.154-51.03-26.594-109.498-43.11-152.558-43.11-16.906 0-30.906 2.532-41.624 7.532a42.69 42.69 0 0 0-23.03 27.14c-6.562 23.39-9.156 45.044-7.718 64.326 1.688 22.578 8.782 42.358 21.092 58.764 14.124 18.796 34.842 33.188 61.592 42.764 23.562 8.422 51.654 12.89 81.278 12.89 32.906 0 66.468-5.454 94.53-15.344 26.312-9.28 40.812-20 48.342-27.342a42.638 42.638 0 0 0 9.344-47.466z m-71.872 34.576c-23.624 8.328-52.154 12.906-80.342 12.906-24.78 0-47.904-3.594-66.904-10.39-18.75-6.718-32.812-16.204-41.842-28.202-14.75-19.67-16.906-48.578-6.436-85.95 2.5-1.156 9.342-3.532 23.592-3.532 36.062 0 88.216 15.03 132.84 38.28 44.75 23.312 66.342 46.624 71.81 59.25-3.97 3.904-13.844 10.982-32.718 17.638z\"></path>' +
        '</svg></span> 匿名</button>';
    var $anonymous = $(a);
    $anonymous.bind("click", function () {
        $more.find("button").click();
        $(".Menu.QuestionHeader-menu").children().eq(0).click();
    });
    $QuestionHeaderActions.append($anonymous);
}
 
//添加"问题日志"按钮
function addLog ($QuestionHeaderActions) {
    var url = window.location.href;
    var end, href;
    if (url.indexOf("?") > -1) {
        end = url.indexOf("?");
        url = url.substring(0, end);
    }
 
    if (url.indexOf("answer") > -1) {
        end = url.indexOf("answer");
        href = url.substring(0, end);
    }
    else {
        href = url + "/";
    }
    var L = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\"><a href=\"' + href + 'log\" target=\"_self\"><span style=\"display: inline-flex; align-items: center; vertical-align:middle;\"><svg class=\"Zi Zi--Log Button-zi\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" width=\"1.2em\" height=\"1.2em\"><path d=\"M733.129568 1.700997H1.700997v1020.598006h1020.598006v-765.448505z m204.119601 935.548172h-850.498338v-850.498338h614.910299l235.588039 206.671096z\"></path><path d=\"M170.099668 171.800664h279.813953v85.049834H170.099668zM170.099668 372.518272h683.800664v85.049834H170.099668zM170.099668 567.282392h683.800664v85.049834H170.099668zM170.099668 762.046512h683.800664v85.049834H170.099668z\"></path></svg></span>问题日志</a></button>';
    var $log = $(L);
    $QuestionHeaderActions.append($log);
}
 
//添加"快捷键"按钮
function addShortCut ($QuestionHeaderActions) {
    var s = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center; vertical-align:middle;\"><svg class=\"Zi Zi--ShortCut Button-zi\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" width=\"1.5em\" height=\"1.2em\"><path d=\"M1088 128H64C28.8 128 0 156.8 0 192v640c0 35.2 28.8 64 64 64h1024c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64zM640 256h128v128h-128V256z m192 192v128h-128v-128h128zM448 256h128v128h-128V256z m192 192v128h-128v-128h128zM256 256h128v128H256V256z m192 192v128h-128v-128h128zM128 256h64v128H128V256z m0 192h128v128H128v-128z m64 320H128v-128h64v128z m576 0H256v-128h512v128z m256 0h-192v-128h192v128z m0-192h-128v-128h128v128z m0-192h-192V256h192v128z\"></path></svg></span>  快捷键</button>';
    var $shortcut = $(s);
    $shortcut.css({ "margin-left": "10px" });
    $shortcut.click(function () {
        $(".Modal-wrapper").show();
    });
    $QuestionHeaderActions.append($shortcut);
 
}
 
//UTC标准时转UTC+8北京时间
function getUTC8 (datetime) {
    let month = (datetime.getMonth() + 1) < 10 ? "0" + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
    let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    let hours = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    let minutes = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    let seconds = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return (datetime.getFullYear() + "-" + month + "-" + date + "\xa0\xa0" + hours + ":" + minutes + ":" + seconds);
}
 
 
//回答页
function question () {
    if (hideQuestionSidebar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".Question-sideColumn.Question-sideColumn--sticky").hide();
        if ($(".ListShortcut").length > 0) {
            $(".ListShortcut").width($(".Question-main").width());
            $(".Question-mainColumn").width($(".ListShortcut").width());
            $(".ContentItem-actions").width($(".Question-mainColumn").width() - 40); //每个回答的的margin-left + margin-right=40px，减去才能正好居中
 
        }
        else {
            $(".Question-mainColumn").width($(".Question-main").width());
            $(".ContentItem-actions").width($(".Question-mainColumn").width() - 40); //每个回答的的margin-left + margin-right=40px，减去才能正好居中
        }
    }
    else if (hideQuestionSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".Question-sideColumn.Question-sideColumn--sticky").hide();
 
        $(".Question-main").attr("style", "display:flex;justify-content:center;");
        $(".ContentItem-actions").width($(".Question-mainColumn").width() - 40); //每个回答的的margin-left + margin-right=40px，减去才能正好居中
    }
 
    //首页顶部导航栏"等你来答"页
    if (window.location.href.indexOf("waiting") > -1) {
        if (hideIndexSidebar == 1) //隐藏侧边栏并拉宽内容
        {
            $(".GlobalSideBar").hide();
            $(".QuestionWaiting-mainColumn").width($(".QuestionWaiting").width());
        }
        else if (hideIndexSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
        {
            $(".GlobalSideBar").hide();
            $(".QuestionWaiting").attr("style", "display:flex;justify-content:center;");
        }
    }
 
    //稍后答功能
    if (hideLaterSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".GlobalSideBar").hide();
        $(".QuestionLater-mainColumn").width($(".QuestionLater").width());
    }
    else if (hideLaterSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".GlobalSideBar").hide();
        $(".QuestionLater").attr("style", "display:flex;justify-content:center;");
    }
 
    //问题编辑时间参考：https://greasyfork.org/zh-CN/scripts/398195
    if ($(".QuestionPage .QuestionHeader-side p").length == 0 && window.location.href.indexOf("log") == -1) //非问题日志页
    {
        let createtime = $(".QuestionPage>[itemprop~=dateCreated]").attr("content");
        let modifiedtime = $(".QuestionPage>[itemprop~=dateModified]").attr("content");
        createtime = getUTC8(new Date(createtime));
        modifiedtime = getUTC8(new Date(modifiedtime));
 
        $(".QuestionPage .QuestionHeader-side").append('<div style=\"color:#8590a6; margin-top:15px\"><p>创建时间:&nbsp;&nbsp;' + createtime + '</p><p>最后编辑:&nbsp;&nbsp;' + modifiedtime + '</p></div>');
    }
 
    //快捷键提示框
    if ($(".Modal-wrapper").length == 0) {
        $(document.body).append($hint);
        $(".Modal-wrapper").hide();
        $(".Modal-closeButton").click(function () {
            $(".Modal-wrapper").hide();
        });
    }
 
    //问题标题
    var $QuestionHeaderActions = $("div.QuestionHeaderActions");
 
    var $titlemore = $QuestionHeaderActions.find(".Zi--Dots").parent().parent().parent(); //更多
    var $titlereport = $QuestionHeaderActions.find(".Title.Zi--Report"); //举报
    var $anonymous = $(".Zi--Anonymous");//匿名
    var $log = $(".Zi--Log"); //日志
    var $shortcut = $(".Zi--ShortCut"); //快捷键
 
    if ($(".AppHeader-profileAvatar").length > 0) //已登录
    {
        if ($titlereport.length == 0) //题目未添加举报
        {
            $titlemore.hide();
            let button_text = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center; vertical-align:middle;\"><svg class=\"Title Zi--Report \" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
            let $report = $(button_text);
            $report.bind("click", function () {
                $titlemore.find("button").click();
                $(".Menu.QuestionHeader-menu").children().eq(2).click();
            });
            $titlemore.after($report);
        }
        if ($anonymous.length == 0) //未添加匿名
        {
            addAnonymous($QuestionHeaderActions, $titlemore);
        }
        if ($log.length == 0) //未添加查看问题日志
        {
            addLog($QuestionHeaderActions);
        }
        if ($shortcut.length == 0) //未添加快捷键帮助
        {
            addShortCut($QuestionHeaderActions);
        }
 
        //回答举报按钮
        $(".ContentItem-actions").each(function () {
 
            if ($(this).find(".Zi--Report").length == 0 && $(this).find(".Zi--Settings").length == 0) //未添加举报 且 不是自己的回答
            {
                let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
                $question_dot.hide();
                let button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
                let $report = $(button_text);
                $report.bind("click", function () {
                    $question_dot.find("button").click();
                    $(".Menu.AnswerItem-selfMenu").find("button").each(function () {
                        if ($(this).text().indexOf("举报") > -1)
                            $(this).click();
                    });
                });
                $question_dot.after($report);
            }
            else
            {
                $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
            }
        });
 
    }
    else //未登录
    {
        $(".Zi--Dots").parent().parent().parent().hide();
 
        $log = $(".Zi--Log"); //日志
        $shortcut = $(".Zi--ShortCut"); //快捷键
 
        if ($log.length == 0) //未添加查看问题日志
        {
            addLog($QuestionHeaderActions);
        }
        if ($shortcut.length == 0) //未添加快捷键帮助
        {
            addShortCut($QuestionHeaderActions);
        }
    }
 
    //调整问题的按钮间距
    $(".QuestionHeaderActions .QuestionHeader-Comment").css({ "margin": "0px 0px 0px 0px" });
    $(".QuestionHeaderActions .Popover.ShareMenu").css({ "margin": "0px 0px 0px 0px" });
    $(".QuestionHeaderActions .Button.Button--plain.Button--withIcon.Button--withLabel").css({ "margin": "0px 0px 0px 9px" });
 
    var $QuestionButtonGroup = $(".QuestionHeader-footer-main").find(".QuestionButtonGroup");
    $QuestionButtonGroup.children().eq(0).css({ "margin": "0px 0px 0px 8px" });
    $QuestionButtonGroup.children().eq(1).css({ "margin": "0px 0px 0px 8px" });
 
    $(".QuestionHeaderActions").children().eq(0).css({ "margin": "0px 8px 0px 0px" });
 
    $(".GoodQuestionAction-commonBtn").css("margin", "0px 0px 0px 0px");
 
 
    //回答的发布时间
    $(".ContentItem.AnswerItem").each(function () {
        if (!($(this).find(".ContentItem-time").hasClass("full")) && $(this).find(".ContentItem-time").length > 0 && $(this).find(".ContentItem-time").find("span").text() != null) {
            if ($(this).find(".ContentItem-time").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time").find("span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time").find("span").text();
                $(this).find(".ContentItem-time").find("span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time").addClass("full");
            }
            else if ($(this).find(".ContentItem-time").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time").find("span").attr("data-tooltip");
                $(this).find(".ContentItem-time").find("span").text(data_tooltip);
                $(this).find(".ContentItem-time").addClass("full");
            }
 
            //发布时间置顶
            if (publishTop == 1) {
                if (!$(this).find(".ContentItem-time").parent().hasClass("ContentItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time").clone();
                    $(this).find(".RichContent .ContentItem-time").hide();
                    $(this).find(".ContentItem-meta").append(temp_time);
                }
            }
        }
 
    });
 
    $(".Pc-card.Card").attr("style", "display:none");
 
    //查看全部回答按钮变色
    $(".QuestionMainAction").attr("style", "color:white;background-color:#0084FF");
 
}
 
 
//知乎跳转链接转为直链
function directLink () {
    var equal, colon, external_href, protocol, path, new_href;
    //文字链接
    $("a[class*=\'external\']").each(function () {
        if ($(this).find("span").length > 0) {
            new_href = $(this).text();
            $(this).attr("href", new_href);
        }
        else if ($(this).attr("href").indexOf("link.zhihu.com/?target=") > -1) {
            external_href = $(this).attr("href");
            new_href = external_href.substring($(this).attr("href").indexOf("link.zhihu.com/?target=") + "link.zhihu.com/?target=".length);
            $(this).attr("href", decodeURIComponent(new_href));
        }
        else {
            external_href = $(this).attr("href");
            if (external_href.lastIndexOf("https%3A"))
                new_href = $(this).attr("href").substring($(this).attr("href").lastIndexOf("https%3A"));
            else if (external_href.lastIndexOf("http%3A%2F%2F"))
                new_href = $(this).attr("href").substring($(this).attr("href").lastIndexOf("http%3A"));
            $(this).attr("href", decodeURIComponent(new_href));
        }
    });
 
    //卡片链接
    $("a[class*=\'LinkCard\']:not([class*=\'MCNLinkCard\']):not([class*=\'ZVideoLinkCard\'])").each(function () {
        if ($(this).find("LinkCard-title").length > 0 && $(this).find("LinkCard-title").indexOf("http") > -1) {
            new_href = $(this).find("LinkCard-title").text();
            $(this).attr("href", new_href);
        }
        else if ($(this).attr("href").indexOf("link.zhihu.com/?target=") > -1) {
            external_href = $(this).attr("href");
            new_href = external_href.substring($(this).attr("href").indexOf("link.zhihu.com/?target=") + "link.zhihu.com/?target=".length);
            $(this).attr("href", decodeURIComponent(new_href));
        }
        else {
            external_href = $(this).attr("href");
            if (external_href.lastIndexOf("https%3A"))
                new_href = $(this).attr("href").substring($(this).attr("href").lastIndexOf("https%3A"));
            else if (external_href.lastIndexOf("http%3A%2F%2F"))
                new_href = $(this).attr("href").substring($(this).attr("href").lastIndexOf("http%3A"));
            $(this).attr("href", decodeURIComponent(new_href));
        }
    });
 
    //旧版视频卡片链接
    $("a.VideoCard-link").each(function () {
        if ($(this).attr("href").indexOf("link.zhihu.com/?target=") > -1) {
            external_href = $(this).attr("href");
            equal = external_href.lastIndexOf("http");
            colon = external_href.lastIndexOf("%3A");
            protocol = external_href.substring(equal, colon);
            path = external_href.substring(colon + 5, external_href.length);
            new_href = protocol + "://" + path;
            $(this).attr("href", decodeURIComponent(new_href));
        }
    });
 
    //隐藏首页广告卡片
    $(".TopstoryItem--advertCard").hide();
 
}
 
var upload_video_main_flag=0;
 
//知乎专栏
function zhuanlan () {
    //隐藏推荐文章
    if(hideRecommendedReading == 1)
    {
        $(".Recommendations-Main").hide();
    }
 
    //专栏举报按钮
    if ($(".Zi--Report").length == 0) //未添加举报
    {
        let $lastchild = $(".ContentItem-actions").children().eq(-1);
        if ($lastchild.find(".Zi--Dots").length > 0)
            $lastchild.hide();
        var button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
        var $report = $(button_text);
        $report.bind("click", function () {
            $lastchild.find("button").click();
            $(".Menu.Post-ActionMenu").find("button").click();
        });
        $lastchild.after($report);
    }
 
    //有"编辑于"时，增加发布时间
    if ($(".ContentItem-time").text().indexOf("编辑于") > -1 && !$(".ContentItem-time").hasClass("done")) {
        let bianjiyu = $(".ContentItem-time").text();
        $(".ContentItem-time").click();
        $(".ContentItem-time").text($(".ContentItem-time").text() + "\xa0\xa0，\xa0\xa0" + bianjiyu);
        $(".ContentItem-time").addClass("done");
    }
 
    //发布时间置顶
    if (publishTop == 1 && $(".Post-Header").find(".ContentItem-time").length == 0) {
        $(".ContentItem-time").css({ "padding": "0px 0px 0px 0px", "margin-top": "14px" });
        $(".ContentItem-time").appendTo($(".Post-Header"));
    }
 
    //专栏设置的已选菜单项变色
    $(".css-17px4ve").parent().each(function () {
        if ($(this).find(".css-17px4ve").children().length > 0) {
            $(this).css("color", "black");
            $(this).find(".Zi--Check").attr("fill", "black");
        }
    });
 
}
 
//视频页
function zvideo () {
    //隐藏推荐视频
    $(".ZVideo-sideColumn").hide();
}
 
//知乎圈子
function club () {
    if (hideClubSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".ClubSideBar").hide();
        $(".Club-mainColumn").width($(".Club-container").width());
        $(".ClubEdit").width($(".Club-mainColumn").width() - 40);//每个提问的的margin-left + margin-right=40px，减去才能正好居中
        $('.ClubTopPosts').width($(".Club-mainColumn").width()-32);
        $('.ClubPostList').width($(".Club-mainColumn").width());
        $('.PostItem.css-1b27c42').width($(".Club-mainColumn").width() - 32);
        $('section').css('border-right','none');
    }
    else if (hideClubSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".ClubSideBar").hide();
        $(".Club-mainColumn").parent().attr("style", "display:flex;justify-content:center;");
        $(".ClubEdit").width($(".Club-mainColumn").width() - 40); //每个提问的的margin-left + margin-right=40px，减去才能正好居中
        $('.ClubTopPosts').width($(".Club-mainColumn").width()-32);
        $('.ClubPostList').width($(".Club-mainColumn").width());
        $('.PostItem.css-1b27c42').width($(".Club-mainColumn").width() - 32);
        $('section').css('border-right','none');
    }
 
    //退出圈子按钮
    var $ClubHeaderInfo_buttonGroup = $(".ClubHeaderInfo-buttonGroup");
    var $child1 = $ClubHeaderInfo_buttonGroup.children().eq(1 - 1);
    var $child2 = $ClubHeaderInfo_buttonGroup.children().eq(2 - 1);
    if ($child2.length > 0 && $child2.text().indexOf("签到") > -1 && $child2.text().indexOf("加入") == -1) //退出圈子
    {
        $child1.hide();
        let button_text = '<button class=\"ClubJoinOrCheckinButton\" style=\"margin-right:20px\"><img src=\"https://gitee.com/AN_drew/picBed/raw/master/img/exit.svg\"/><span style=\"color:red\">&nbsp;退出圈子</span></button>';
        let $report = $(button_text);
        $report.bind("click", function () {
            $child1.find("button").click();
            $(".ClubHeaderInfoMoreButton-item").click();
        });
        $child1.after($report);
    }
 
    //圈子中提问举报按钮
    $(".PostReaction").each(function () {
        var $post_dot = $(this).find(".Zi--Dots").closest(".Popover");
        if ($(this).find(".Zi--Report").length == 0) //未添加举报
        {
            $post_dot.hide();
            let button_text = '<button type=\"button\" class=\"Button PostWebActionButtons-comment Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
            let $report = $(button_text);
            $report.bind("click", function () {
                $post_dot.find("button").click();
                $(".PostWebActionButtons-item").click();
            });
            $post_dot.after($report);
        }
    });
 
    //有"最后回复"时，增加发布时间
    $(".PostItem-time").each(function () {
 
        if ($(this).text().indexOf("发布时间") == -1 && $(this).parent().text().indexOf("最后回复") > -1) {
            let datetime = new Date($(this).attr("datetime"));
            let posttime = getUTC8(datetime);
            let replytime = $(this).text();
 
            $(this).parent().get(0).childNodes[1].nodeValue = "";
            $(this).parent().get(0).childNodes[2].nodeValue = "";
            $(this).text("发布时间 " + posttime + "\xa0\xa0，\xa0\xa0" + "最后回复 " + replytime);
 
        }
    });
}
 
//获取url中?后面的参数
function getQueryVariable (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
 
//搜索结果页
function search () {
    if (hideSearchSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".SearchSideBar").hide();
        $(".SearchMain").width($(".Search-container").width());
    }
    else if (hideSearchSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".SearchSideBar").hide();
        $(".Search-container").attr("style", "display:flex;justify-content:center;");
    }
 
 
    $(".ContentItem.AnswerItem, .ContentItem.ArticleItem").each(function () {
        if (!($(this).find(".ContentItem-time").hasClass("full")) && $(this).find(".ContentItem-time").length > 0 && $(this).find(".ContentItem-time").find("span").text() != null) {
            if ($(this).find(".ContentItem-time").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time").text().indexOf("编辑于") > -1)  //只有"编辑于"时，增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time").find("span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time").find("span").text();
                $(this).find(".ContentItem-time").find("span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time").addClass("full");
            }
            else if ($(this).find(".ContentItem-time").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time").find("span").attr("data-tooltip");
                $(this).find(".ContentItem-time").find("span").text(data_tooltip);
                $(this).find(".ContentItem-time").addClass("full");
            }
 
            //发布时间置顶
            if (publishTop == 1) {
                if (!$(this).find(".ContentItem-time").parent().hasClass("SearchItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time").clone();
                    $(this).find(".RichContent .ContentItem-time").hide();
                    $(this).find(".SearchItem-meta").append(temp_time);
                }
            }
        }
 
    });
 
    //隐藏相关推荐的卡片，仅保留问题卡片
    $(".RelevantQuery").closest(".Card.SearchResult-Card").hide();
    $(".KfeCollection-PcCollegeCard-wrapper").closest(".Card.SearchResult-Card").hide();
    if (getQueryVariable("type") == "content") {
        $('.Card.SearchResult-Card[data-za-detail-view-path-module=\"UserItem\"]').hide();
    }
 
}
 
//知乎讲座
function lives () {
    $("[class*=\'LiveWechatSpread\']").hide(); //隐藏微信推荐
}
 
//收藏夹
function collection () {
    if (hideCollectionSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".CollectionDetailPageSideBar").hide();
        $(".CollectionsDetailPage-mainColumn").width($(".CollectionsDetailPage").width());
 
        $(".GlobalSideBar").hide();
        $(".Collections-mainColumn").width($(".Collections-container").width());
    }
    else if (hideCollectionSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".CollectionDetailPageSideBar").hide();
        $(".CollectionsDetailPage-mainColumn").parent().attr("style", "display:flex;justify-content:center;");
 
        $(".GlobalSideBar").hide();
        $(".Collections-mainColumn").parent().attr("style", "display:flex;justify-content:center;");
    }
 
    //收藏夹举报按钮
    $(".ContentItem-actions").each(function () {
        var $collect_dot = $(this).find(".Zi--Dots").closest(".Popover");
        if ($(this).find(".Zi--Report").length == 0) //未添加举报
        {
            $collect_dot.hide();
            let button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
            let $report = $(button_text);
            $report.bind("click", function () {
                $collect_dot.find("button").click();
                $(".AnswerItem-selfMenu").children().eq(1).click();
            });
            $collect_dot.after($report);
        }
    });
}
 
//按钮变色
function iconColor () {
 
    //引用角标高亮
    $('.ztext sup[data-draft-type=reference]').click(function(){
 
        $('.ReferenceList li').removeClass('is-active');
        let ref_id = $(this).find('a').attr('href');
        $(this).closest('.List-item').find(ref_id).addClass('is-active');
        $(this).closest('.ContentItem.AnswerItem').find(ref_id).addClass('is-active');
        $(this).closest('.Post-content').find(ref_id).addClass('is-active');
        $(this).closest('.TopicIntroContent').find(ref_id).addClass('is-active');
    });
 
    //悬停时显示浅蓝色边框
    if (hoverShadow == 1) {
        if (typeof ($("html").attr("data-hover-visible")) == "undefined") {
            $("html").attr("data-hover-visible", "1");
        }
        $("html").removeAttr("data-focus-visible"); //避免快捷键变色的影响
    }
 
    $(".Zi--List").parent().parent().hover(function () {
        $(this).find(".Zi--List").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function () {
        $(this).find(".Zi--List").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".Zi--Comment").parent().parent().hover(function () {
        $(this).find(".Zi--Comment").attr("fill", "#0084FF");
 
        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).attr("style", "color:#0084FF;margin: 0px 0px 0px 9px;");
        else
            $(this).attr("style", "color:#0084FF");
 
    }, function () {
        if ($(this).closest(".QuestionHeaderActions").length > 0) {
            $(this).find(".Zi--Comment").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
        }
        else {
            if ($(this).prop('lastChild').nodeValue.indexOf("收起评论") == -1) {
                $(this).find(".Zi--Comment").attr("fill", "currentColor");
                $(this).attr("style", "color:#8590A6");
            }
        }
    });
 
    $(".Zi--Comment").parent().parent().each(function () {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("收起评论") > -1) {
            $(this).find(".Zi--Comment").attr("fill", "#0084FF");
            $(this).attr("style", "color:#0084FF");
        }
    });
 
    $('.Zi--Catalog').closest('button').hover(function(){
        $(this).attr('style','color:#10dede');
    },function(){
        $(this).attr('style','color:#8590a6');
    });
 
    $(".Zi--Close").on("click", function () {
        $(".Zi--Comment").parent().parent().each(function () {
            if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("收起评论") > -1) {
                $(this).find(".Zi--Comment").attr("fill", "currentColor");
                $(this).attr("style", "color:#8590A6");
            }
        });
    });
 
    $(".Zi--Comments").parent().parent().hover(function () {
        $(this).find(".Zi--Comments").find("path").attr("fill", "#00FF7F");
        $(this).css({ "color": "#00FF7F" });
    }, function () {
 
        if ($(this).hasClass("CommentItemV2-talkBtn")) //评论区查看回复按钮变色
        {
            $(this).find(".Zi--Comments").find("path").attr("fill", "#8590a6");
            $(this).css({ "color": "#8590a6" });
        }
        else if ($(".Messages-content").length == 0) //私信框消失，私信按钮变色
        {
            if ($("html").attr("data-theme") == "dark") {
                $(this).find(".Zi--Comments").find("path").attr("fill", "#8590a6");
                $(this).css({ "color": "#8590a6" });
            }
            else {
                $(this).find(".Zi--Comments").find("path").attr("fill", "rgb(68,68,68)");
                $(this).css({ "color": "rgb(68,68,68)" });
            }
        }
    });
 
    $(".Zi--Reply").parent().parent().hover(function () {
        $(this).find(".Zi--Reply").attr("fill", "#32CD32");
        $(this).attr("style", "color:#32CD32");
    }, function () {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消回复") == -1) {
            $(this).find(".Zi--Reply").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        }
    });
 
    $(".Zi--Reply").parent().parent().each(function () {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消回复") > -1) {
            $(this).find(".Zi--Reply").attr("fill", "#32CD32");
            $(this).attr("style", "color:#32CD32");
        }
    });
 
    $(".Zi--Like").parent().parent().hover(function () {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("踩") > -1 || $(this).attr("data-tooltip") == "不推荐") {
            if ($("html").attr("data-theme") == "dark") {
                $(this).find(".Zi--Like").attr("fill", "white");
                $(this).css("color", "white");
            }
            else {
                $(this).find(".Zi--Like").attr("fill", "black");
                $(this).css("color", "black");
            }
        }
        else if (window.location.href.indexOf("search") > -1) {
            if ($(this).hasClass("SearchTopicReview-Icon--like") || $(this).hasClass("SearchTopicReview-Icon--liked")) {
                $(this).find(".Zi--Like").find("path").attr("fill", "#FF4D82");
                $(this).attr("style", "color:#FF4D82;");
            }
            else {
                $(this).find(".Zi--Like").find("path").attr("fill", "black");
                $(this).attr("style", "color:black;");
            }
        }
        else if (window.location.href.indexOf("people") > -1 || window.location.href.indexOf("org") > -1) {
            $(this).find(".Zi--Like").attr("fill", "#FF4D82");
            $(this).attr("style", "color:#FF4D82;");
        }
        else {
            $(this).find(".Zi--Like").attr("fill", "#FF4D82");
            $(this).attr("style", "color:#FF4D82;margin:0px;");
        }
    }, function () {
        if ($(this).find("#topic-recommend").length > 0 || $(this).find("#topic-against").length > 0 || $(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消踩") == -1)
            $(this).find(".Zi--Like").attr("fill", "currentColor");
 
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消踩") > -1) {
            $(this).attr("style", "color:black;");
        }
        else if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("踩") > -1 || $(this).attr("data-tooltip") == "不推荐") {
            $(this).attr("style", "color:#8590A6;");
        }
        else if (window.location.href.indexOf("search") > -1) {
            $(this).find(".Zi--Like").find("path").attr("fill", "#8590A6");
            $(this).attr("style", "color:#8590A6;");
        }
        else if (window.location.href.indexOf("people") > -1 || window.location.href.indexOf("org") > -1) {
            if ($(this).hasClass("css-1pbw4sw")) //认证与成就
            {
                $(this).find(".Zi--Like").attr("fill", "#FF4D82");
                $(this).attr("style", "color:#FF4D82;");
            }
            else //普通回答
            {
                $(this).find(".Zi--Like").attr("fill", "#8590A6");
                $(this).attr("style", "color:#8590A6;");
            }
        }
        else
            $(this).attr("style", "color:#8590A6; margin:0px;");
    });
 
    $(".Zi--Like").parent().parent().each(function () {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue == "取消踩")
            $(this).find(".Zi--Like").attr("fill", "black");
 
        if (window.location.href.indexOf("search") > -1) {
            if ($(this).hasClass("SearchTopicReview-Icon--liked")) {
                $(this).find(".Zi--Like").find("path").attr("fill", "#FF4D82");
                $(this).attr("style", "color:#FF4D82;");
            }
        }
        else if (window.location.href.indexOf("people") > -1 || window.location.href.indexOf("org") > -1) {
            if ($(this).hasClass("css-1pbw4sw") || $(this).hasClass("is-liked")) {
                $(this).find(".Zi--Like").attr("fill", "#FF4D82");
                $(this).attr("style", "color:#FF4D82;");
            }
        }
    });
 
    $(".GoodQuestionAction-highLightBtn").attr("style", "color:#FF4D82;margin:0px;"); //题目点赞后保持变色
    $(".is-liked").attr("style", "color:#FF4D82;margin:0px;"); //评论点赞后保持变色
 
 
    $(".Zi--Share").parent().parent().parent().hover(function () {
        $(this).find(".Zi--Share").attr("fill", "blue");
 
        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).find("button").attr("style", "color:blue;margin: 0px 0px 0px 9px;");
        else if ($(this).find(".Post-SideActions-icon").length > 0)
            $(this).attr("style", "color:blue;");
        else
            $(this).find("button").attr("style", "color:blue;");
 
    }, function () {
        $(this).find(".Zi--Share").attr("fill", "currentColor");
 
        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).find("button").attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
        else if ($(this).find(".Post-SideActions-icon").length > 0)
            $(this).attr("style", "color:#8590A6;");
        else
            $(this).find("button").attr("style", "color:#8590A6;");
    });
 
 
    $(".Zi--Star").parent().parent().hover(function () {
        if (!$(this).hasClass("ExploreHomePage-ContentSection") && !$(this).hasClass("css-18biwo") && !$(this).hasClass("css-g9eqf4-StrutAlign")) {
            $(this).find(".Zi--Star").attr("fill", "orange");
            $(this).attr("style", "color:orange");
        }
    }, function () {
        if (!$(this).hasClass("ExploreHomePage-ContentSection") && !$(this).hasClass("css-18biwo") && !$(this).hasClass("css-g9eqf4-StrutAlign")) {
            $(this).find(".Zi--Star").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        }
    });
 
    $(".Zi--Heart").parent().parent().hover(function () {
        $(this).find(".Zi--Heart").attr("fill", "red");
        $(this).attr("style", "color:red");
    }, function () {
        if ($(this).prop('lastChild').nodeValue == "喜欢")
            $(this).find(".Zi--Heart").attr("fill", "currentColor");
 
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".Zi--Heart").parent().parent().each(function () {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue == "取消喜欢")
            $(this).prop('lastChild').nodeValue = "已喜欢";
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue == "已喜欢") {
            $(this).find(".Zi--Heart").attr("fill", "red");
            $(this).attr("style", "color:red");
        }
    });
 
    $(".Zi--Report").parent().parent().hover(function () {
        $(this).find(".Zi--Report").attr("fill", "brown");
 
        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).attr("style", "color:brown;margin: 0px 0px 0px 9px;");
        else
            $(this).attr("style", "color:brown");
 
    }, function () {
        $(this).find(".Zi--Report").attr("fill", "currentColor");
 
        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
        else
            $(this).attr("style", "color:#8590A6");
    });
 
    /*
    $(".Zi--Bell").parent().parent().hover(function () {
        $(this).find(".Zi--Bell path").attr("fill", "#FACB62");
    }, function () {
        if ($(".PushNotifications-content").length == 0) //没有通知框，恢复原色
        {
            if ($("html").attr("data-theme") == "light") //日间模式
            {
                $(this).find(".Zi--Bell path").attr("fill", "rgb(68,68,68)");
            }
            else //夜间模式
            {
                $(this).find(".Zi--Bell path").attr("fill", "#8590A6");
            }
        }
        else //有通知框，持续变色
        {
            $(this).find(".Zi--Bell path").attr("fill", "#FACB62");
        }
    });
 
    $(".Zi--Bell").parent().parent().on("click", function () {
        if ($(".PushNotifications-content").length == 0) {
            $(this).find(".Zi--Bell path").attr("fill", "#FACB62");
        }
        else {
            $(this).find(".Zi--Bell path").attr("fill", "currentColor");
        }
    });
*/
 
    $(".Zi--Heart.PushNotifications-tabIcon").parent().parent().hover(function () {
        $(this).find(".Zi--Heart").attr("fill", "#0084FF");
    }, function () {
        $(this).find(".Zi--Heart").attr("fill", "currentColor");
    });
 
    $(".Zi--Users").parent().parent().hover(function () {
        $(this).find(".Zi--Users").attr("fill", "#0084FF");
    }, function () {
        $(this).find(".Zi--Users").attr("fill", "currentColor");
    });
 
    $(".Zi--Anonymous").parent().parent().hover(function () {
        if ($("html").attr("data-theme") == "dark") {
            $(this).find(".Zi--Anonymous").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3;margin: 0px 0px 0px 9px;");
        }
        else {
            $(this).find(".Zi--Anonymous").attr("fill", "black");
            $(this).attr("style", "color:black;margin: 0px 0px 0px 9px;");
        }
    }, function () {
        $(this).find(".Zi--Anonymous").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
    });
 
    $(".Zi--Log").parent().parent().hover(function () {
        $(this).find(".Zi--Log").attr("fill", "purple");
        $(this).parent().attr("style", "color:purple;margin: 0px 0px 0px 9px;");
    }, function () {
        $(this).find(".Zi--Log").attr("fill", "currentColor");
        $(this).parent().attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
    });
 
    $(".Zi--ShortCut").parent().parent().hover(function () {
        $(this).find(".Zi--ShortCut").attr("fill", "#44B8A1");
        $(this).attr("style", "color:#44B8A1;margin: 0px 0px 0px 9px;");
    }, function () {
        $(this).find(".Zi--ShortCut").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
    });
 
    $(".Zi--Invite").parent().parent().hover(function () {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".Zi--Invite").attr("fill", "black");
            $(this).attr("style", "color:black;margin: 0px 8px 0px 0px;");
        }
        else {
            $(this).find(".Zi--Invite").attr("fill", "white");
            $(this).attr("style", "color:white;margin: 0px 8px 0px 0px;");
        }
    }, function () {
        $(this).find(".Zi--Invite").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6;margin: 0px 8px 0px 0px;");
    });
 
    $(".Zi--Trash").parent().parent().hover(function () {
        $(this).find(".Zi--Trash").attr("fill", "#C70000");
        $(this).attr("style", "color:#C70000");
    }, function () {
        $(this).find(".Zi--Trash").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".SelfCollectionItem-actions .Zi--EditSurround").parent().parent().hover(function () {
        $(this).find(".Zi--EditSurround").attr("fill", "orange");
        $(this).attr("style", "color:orange");
    }, function () {
        $(this).find(".Zi--EditSurround").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".CollectionDetailPageHeader-actions .Zi--EditSurround").parent().parent().hover(function () {
        $(this).find(".Zi--EditSurround").attr("fill", "orange");
        $(this).attr("style", "color:orange");
    }, function () {
        $(this).find(".Zi--EditSurround").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".Zi--Emotion").parent().parent().hover(function () {
        $(this).find(".Zi--Emotion").find("path").attr("fill", "#0084FF");
    }, function () {
        $(this).find(".Zi--Emotion").find("path").removeAttr("fill");
    });
 
    $(".Zi--AddImage").parent().parent().hover(function () {
        $(this).find(".Zi--AddImage").find("path").attr("fill", "#0084FF");
    }, function () {
        $(this).find(".Zi--AddImage").find("path").removeAttr("fill");
    });
 
    $(".Zi--InsertImage").find("path").attr("fill", "blue");
    $(".Zi--Image").find("path").attr("fill", "blue");
 
    $(".Zi--InsertVideo, .Zi--FormatClear").find("path").attr("fill", "red");
 
    $(".Zi--InsertFormula").find("path").attr("fill", "rgb(115,216,244)");
 
    $(".Zi--InsertLink").find("path").attr("fill", "#0084FF");
 
    $(".Zi--Folder").find("path").attr("fill", "#FF8C00");
 
    $(".Zi--EditCircle").find("path").attr("fill", "#82480E");
 
    $(".Zi--Juror").find("path").attr("fill", "brown");
 
    $(".Zi--Marked").find("path").attr("fill", "blue");
 
    if($("html").attr("data-theme") == "light")
    {
        $(".MathToolbar-button svg").attr("fill", "black");
        $(".MathToolbar-paletteIcon").css("color", "black");
    }
    else
    {
        $(".MathToolbar-button svg").attr("fill", "#d3d3d3");
        $(".MathToolbar-paletteIcon").css("color", "#d3d3d3");
    }
 
    $(".AnswerAdd-topicBiosButton").attr("style", "color:#0084FF");
    $(".AnswerAdd-topicBiosButton .Zi--Edit").attr("fill", "#0084FF");
 
    $(".Zi--Document").parent().hover(function () {
        $(this).find(".Zi--Document").find("path").attr("fill", "#FF8C00");
        $(this).attr("style", "color:#FF8C00");
    }, function () {
        $(this).find(".Zi--Document").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".Zi--Time").parent().hover(function () {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".Zi--Time").find("path").attr("fill", "black");
            $(this).attr("style", "color:black");
        }
        else {
            $(this).find(".Zi--Time").find("path").attr("fill", "white");
            $(this).attr("style", "color:white");
        }
    }, function () {
        $(this).find(".Zi--Time").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".Zi--Deliver").parent().parent().hover(function () {
        $(this).find(".Zi--Deliver").find("path").attr("fill", "#02E6B8");
        $(this).attr("style", "color:#02E6B8");
    }, function () {
        $(this).find(".Zi--Deliver").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".Zi--FullscreenEnter").parent().hover(function () {
        $(this).find(".Zi--FullscreenEnter").find("path").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function () {
        $(this).find(".Zi--FullscreenEnter").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".AnswerForm-exitFullscreenButton").hover(function () {
        $(this).find(".AnswerForm-exitFullscreenButton").find("path").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function () {
        $(this).find(".AnswerForm-exitFullscreenButton").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".Notifications-footer .Zi--Settings").parent().parent().hover(function () {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function () {
        $(this).find(".Zi--Settings").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".Post-ActionMenuButton .Zi--Settings").parent().parent().hover(function () {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function () {
        $(this).find(".Zi--Settings").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".TopicActions .Zi--Settings").parent().parent().hover(function () {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function () {
        $(this).find(".Zi--Settings").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".ContentItem-action .Zi--Settings, .AnswerForm-footerRight .Zi--Settings").parent().parent().hover(function () {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function () {
        $(this).find(".Zi--Settings").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".AppHeaderProfileMenu .Zi--Settings").parent().hover(function () {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function () {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".Zi--Settings").attr("fill", "black");
            $(this).attr("style", "color:black");
        }
        else {
            $(this).find(".Zi--Settings").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });
 
    $(".AppHeaderProfileMenu .Zi--Logout").parent().hover(function () {
        $(this).find(".Zi--Logout").attr("fill", "red");
        $(this).attr("style", "color:red");
    }, function () {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".Zi--Logout").attr("fill", "black");
            $(this).attr("style", "color:black");
        }
        else {
            $(this).find(".Zi--Logout").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });
 
    $(".AppHeaderProfileMenu .Zi--Profile").parent().hover(function () {
        $(this).find(".Zi--Profile").attr("fill", "rgb(5,107,0)");
        $(this).attr("style", "color:rgb(5,107,0)");
    }, function () {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".Zi--Profile").attr("fill", "black");
            $(this).attr("style", "color:black");
        }
        else {
            $(this).find(".Zi--Profile").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });
 
    $(".AppHeaderProfileMenu .Zi--Creator").parent().hover(function () {
        $(this).find(".Zi--Creator").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function () {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".Zi--Creator").attr("fill", "black");
            $(this).attr("style", "color:black");
        }
        else {
            $(this).find(".Zi--Creator").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });
 
    $(".CommentMoreReplyButton .Button").hover(function () {
        $(this).attr("style", "color:#00FF7F");
    }, function () {
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".CommentCollapseButton").hover(function () {
        $(this).find("Zi--ArrowUp").attr("fill", "#0084FF");
        $(this).css({ "color": "#0084FF" });
 
    }, function () {
        $(this).find("Zi--ArrowUp").attr("fill", "currentColor");
        $(this).css({ "color": "#8590A6" });
 
    });
 
    //点击评论列表右下角出现的"收起评论"时，将评论按钮恢复灰色
    $(".CommentCollapseButton").on("click", function () {
        let $t = $(this).closest(".Comments-container").prev().find(".Zi--Comment").parent().parent();
        $t.find(".Zi--Comment").attr("fill", "currentColor");
        $t.attr("style", "color:#8590A6");
    });
 
    $(".ContentItem-time").each(function () {
        $(this).find("a").attr("style", "border-bottom: 1px solid rgba(133,144,166,.72)");
    });
 
    $(".Button.ContentItem-action.ContentItem-rightButton.Button--plain").attr("style", "color:#175199");
    $(".QuestionRichText-more").attr("style", "color:#0084FF");
    $(".QuestionHeader-actions .Button").attr("style", "color:#0084FF");
 
    $(".Zi--Switch").attr("fill", "#0084FF");
    $(".Zi--Switch").parent().parent().css("color", "#0084FF");
 
    $(".Zi--Select").attr("fill", "#0084FF");
    $(".Zi--Select").parent().css("color", "#0084FF");
 
    $(".Zi--Dots").hover(function () {
        $(this).find("path").attr("fill", "#0084FF");
    }, function () {
        $(this).find("path").attr("fill", "#8590A6");
    });
 
    $(".Zi--FormatCode").find("path").attr("fill", "#0084FF");
 
    $(".List-headerText").css("top", "-5px");
 
    $(".Post-ActionMenu .Button.Menu-item.Button--plain .Zi--Check").each(function(){
        $(this).parent().parent().parent().addClass('is-active');
    });
 
 
    $(".AnswerItem-selectMenuItem .Zi--Check, .CommentPermission-item .Zi--Check").each(function(){
        $(this).parent().parent().parent().addClass('is-active');
    });
 
    /*
    $(".AnswerItem-selectMenuItem").hover(function () {
        if ($("html").attr("data-theme") == "dark")
            $(this).attr("style", "color:#d3d3d3");
        else
            $(this).attr("style", "color:black");
    }, function () {
        if ($(this).find(".Zi--Check").length == 0)
            $(this).attr("style", "color:#8590A6");
    });
 
    $(".CommentPermission-item").hover(function () {
        if ($("html").attr("data-theme") == "dark")
            $(this).attr("style", "color:#d3d3d3");
        else
            $(this).attr("style", "color:black");
    }, function () {
        if ($(this).find(".Zi--Check").length == 0)
            $(this).attr("style", "color:#8590A6");
    });
*/
 
    $(".AnswerAdd-toggleAnonymous").hover(function () {
        $(this).attr("style", "color:#0084FF");
    }, function () {
        $(this).attr("style", "color:#8590A6");
    });
 
    $(".DisclaimerEntry").hover(function () {
        if ($("html").attr("data-theme") == "dark") {
            $(this).find("path").attr("fill", "#d3d3d3");
            $(this).find("button").attr("style", "color:#d3d3d3");
        }
        else {
            $(this).find("path").attr("fill", "black");
            $(this).find("button").attr("style", "color:black");
        }
    }, function () {
        $(this).find("path").attr("fill", "currentColor");
        $(this).find("button").attr("style", "color:#8590A6");
    });
 
    $(".ImageView.CommentRichText-ImageView.is-active").css({ "z-index": "1000" });
 
    if ($(".css-70qvj9 .Zi--CheckboxOn").length > 0)
        $(".css-70qvj9 .css-1d83bu8").attr("style", "color:#0084FF");
    if ($(".css-70qvj9 .Zi--CheckboxOff").length > 0)
        $(".css-70qvj9 .css-1d83bu8").attr("style", "color:#8590A6");
 
    if ($.cookie('nightmode') == undefined)
        $.cookie('nightmode', 0, { expires: 365, path: "/", domain: "zhihu.com" });
 
    var $nightmode = $('<div><button id=\"nightmode\" style=\"margin-left:15px; margin-top:6px; user-select:none; -webkit-user-select:none; width:100px\">' +
                       '<img style=\"vertical-align:middle; width:18px; height:18px; user-select:none; -webkit-user-select:none; \" src=\"' + dark + '\">' +
                       '<span style=\"vertical-align:middle; user-select:none; -webkit-user-select:none; \" > 夜间模式</span></button></div>');
 
 
    $nightmode.click(function () {
        if ($("html").attr("data-theme") == "light") {
            $("html").attr("data-theme", "dark");
            $(this).find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
            $(this).find("span").text(" 日间模式");
            $.cookie('nightmode', 1, { expires: 365, path: "/", domain: "zhihu.com" });
        }
        else {
            $("html").attr("data-theme", "light");
            $(this).find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
            $(this).find("span").text(" 夜间模式");
            $.cookie('nightmode', 0, { expires: 365, path: "/", domain: "zhihu.com" });
        }
    });
 
    if ($("#nightmode").length == 0) {
        $(".SearchBar").after($nightmode);
 
        var $nightmode_question_log = $nightmode.clone(true);
        $nightmode_question_log.find('button').attr("style","background:transparent; user-select: none; border:none; margin-top:11px; color:#eee; cursor:pointer; width:80px");
        $nightmode_question_log.hover(function(){
            $(this).find('span').css('color','white');
        },function(){
            $(this).find('span').css('color','#eee');
        });
        //$('#zh-top-search-form').width(100);
        //$("#zu-top-add-question").before($nightmode_question_log); //问题日志
 
        var $nightmode_zhuanlan = $nightmode.clone(true);
        $nightmode_zhuanlan.find('button').css({"margin":"0px 50px 0px 0px"});
 
        $(".ColumnPageHeader-WriteButton").before($nightmode_zhuanlan); //专栏文章
        $(".PublishPanel-wrapper").before($nightmode_zhuanlan); //写文章
    }
 
    if ($.cookie('nightmode') == 1) {
        $("html").attr("data-theme", "dark");
        $("#nightmode").find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
        if ($("#nightmode").find("span").text() != " 日间模式")
            $("#nightmode").find("span").text(" 日间模式");
    }
    else {
        $("html").attr("data-theme", "light");
        $("#nightmode").find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
        if ($("#nightmode").find("span").text() != " 夜间模式")
            $("#nightmode").find("span").text(" 夜间模式");
    }
 
    $(".css-6f4i93").hide();
 
    if(upload_video_main_flag==0 && window.location.href.indexOf('upload-video')>0 )
    {
        $('head').append('<style>'+'html[data-theme=dark] main{background:rgb(18,18,18)}'+'</style>');
        upload_video_main_flag=1;
    }
}
 
function index () {
 
    $(".Zi--Hot").find("path").css({ "fill": "red" });
 
 
    $(".Zi--Share").closest(".Button").hover(function () {
        $(this).find("path").css({ "fill": "blue" });
        $(this).css({ "color": "blue" });
    }, function () {
        $(this).find("path").css({ "fill": "#8590A6" });
        $(this).css({ "color": "#8590A6" });
    });
 
    $(".TopstoryItem").each(function () {
        if (!($(this).find(".ContentItem-time").hasClass("full")) && $(this).find(".ContentItem-time").length > 0 && $(this).find(".ContentItem-time").find("span").text() != null) {
            if ($(this).find(".ContentItem-time").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time").find("span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time").find("span").text();
                $(this).find(".ContentItem-time").find("span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time").addClass("full");
            }
            else if ($(this).find(".ContentItem-time").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time").find("span").attr("data-tooltip");
                $(this).find(".ContentItem-time").find("span").text(data_tooltip);
                $(this).find(".ContentItem-time").addClass("full");
            }
 
            //发布时间置顶
            if (publishTop == 1) {
                if (!$(this).find(".ContentItem-time").parent().hasClass("ContentItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time").clone();
                    $(this).find(".RichContent .ContentItem-time").hide();
                    $(this).find(".ContentItem-meta").append(temp_time);
                }
 
            }
        }
 
    });
 
    $(".Card.GlobalSideBar-category>a").hide();
 
    $('.LoadingBar').removeClass('is-active');
 
    $(".Zi--Disinterested").parent().parent().hover(function () {
        $(this).find(".Zi--Disinterested").attr("fill", "rgb(252,96,123)");
        $(this).attr("style", "color:rgb(252,96,123)");
    }, function () {
        $(this).find(".Zi--Disinterested").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
 
    //首页隐藏侧边栏
    if (hideIndexSidebar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".GlobalSideBar").hide();
        $(".GlobalLeftSideBar").hide();
        //$(".Topstory-mainColumn").width($(".Topstory-container").width());
        $(".Topstory-mainColumn").width("1000px");
    }
    else if (hideIndexSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".GlobalSideBar").hide();
        $(".GlobalLeftSideBar").hide();
        $(".Topstory-container").attr("style", "display:flex;justify-content:center;");
    }
 
    //首页回答举报按钮、不感兴趣按钮
    $(".ContentItem-actions").each(function () {
 
        if ($(this).find(".Zi--Report").length == 0 && $(this).find(".Zi--Settings").length == 0) //未添加举报 且 不是自己的回答
        {
            let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
            $question_dot.hide();
            var button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
            var $report = $(button_text);
            $report.bind("click", function () {
                $question_dot.find("button").click();
                $(".Menu.AnswerItem-selfMenu").find("button").each(function () {
                    if ($(this).text().indexOf("举报") > -1)
                        $(this).click();
                });
            });
            $question_dot.after($report);
        }
        else
        {
            $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
        }
 
        if($(this).find(".Zi--Disinterested").length == 0 && $(this).find(".Zi--Settings").length == 0  && $(this).closest('.TopstoryItem').find('.ZVideoItem').length==0 ) //未添加不感兴趣 且 不是自己的回答
        {
            let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
            $question_dot.hide();
            let button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Disinterested\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"3931\" width=\"14\" height=\"14\"><path d=\"M512 32C251.4285715625 32 32 251.4285715625 32 512s219.4285715625 480 480 480 480-219.4285715625 480-480-219.4285715625-480-480-480z m205.7142853125 617.142856875c20.5714284375 20.5714284375 20.5714284375 48 0 61.714286249999994-20.5714284375 20.5714284375-48 20.5714284375-61.714285312499996 0l-137.142856875-137.1428578125L374.857143125 717.7142853125c-20.5714284375 20.5714284375-48 20.5714284375-68.5714284375 0s-20.5714284375-54.857143125 0-68.5714284375l144-144-137.1428578125-137.142856875c-20.5714284375-13.714285312500001-20.5714284375-41.142856875 0-61.714285312499996 20.5714284375-20.5714284375 48-20.5714284375 61.714286249999994 0l137.142856875 137.142856875 144-144c20.5714284375-20.5714284375 48-20.5714284375 68.5714284375 0 20.5714284375 20.5714284375 20.5714284375 48 0 68.5714284375L580.5714284375 512l137.142856875 137.142856875z\"  p-id=\"3932\"></path></svg></span> 不感兴趣</button>';
            let $disinterested = $(button_text);
            $disinterested.bind("click", function () {
                $question_dot.find("button").click();
                $(".Menu.AnswerItem-selfMenu").find("button").each(function () { //回答
                    if ($(this).text().indexOf("不感兴趣") > -1)
                    {
                        $(this).click();
                    }
                });
                $(".Menu.ItemOptions-selfMenu").find("button").each(function () { //专栏
                    if ($(this).text().indexOf("不感兴趣") > -1)
                    {
                        $(this).click();
                    }
                });
            });
            $question_dot.after($disinterested);
        }
        else
        {
            $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
        }
 
    });
 
}
 
var view_details = 0; //详细资料是否被点击的标志
 
//用户主页
function people () {
    //自动点击"查看详细资料"按钮
    if ($(".ProfileHeader-expandButton").text().indexOf("查看详细资料") > -1 && view_details == 0) {
        $(".ProfileHeader-expandButton").click();
        view_details = 1;
    }
 
    if (hideProfileSidebar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".Profile-sideColumn").hide();
        $(".Profile-mainColumn").width($(".Profile-main").width());
    }
    else if (hideProfileSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".Profile-sideColumn").hide();
        $(".Profile-main").attr("style", "display:flex;justify-content:center;");
    }
 
    $(".ContentItem.AnswerItem").each(function () {
        if (!($(this).find(".ContentItem-time").hasClass("full")) && $(this).find(".ContentItem-time").length > 0 && $(this).find(".ContentItem-time").find("span").text() != null) {
            if ($(this).find(".ContentItem-time").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time").find("span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time").find("span").text();
                $(this).find(".ContentItem-time").find("span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time").addClass("full");
            }
            else if ($(this).find(".ContentItem-time").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time").find("span").attr("data-tooltip");
                $(this).find(".ContentItem-time").find("span").text(data_tooltip);
                $(this).find(".ContentItem-time").addClass("full");
            }
 
            //发布时间置顶
            if (publishTop == 1) {
                if (!$(this).find(".ContentItem-time").parent().hasClass("ContentItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time").clone();
                    $(this).find(".RichContent .ContentItem-time").hide();
                    $(this).find(".ContentItem-meta").append(temp_time);
                }
            }
        }
 
    });
}
 
//图片调整到最高清晰度
function originalPic () {
    if(blockingPictureVideo == 1) //隐藏图片/视频
    {
        $('img').each(function(){
            if($(this).closest('.RichContent-cover').length>0 && !$(this).closest('.RichContent-cover').hasClass('hide')) //未隐藏
            {
                $(this).closest('.RichContent-cover').hide(); //隐藏首页回答封面
                $(this).closest('.RichContent-cover').addClass('hide');
            }
 
            if($(this).parent().attr('id') != 'nightmode' && !$(this).hasClass('Avatar')) //非夜间模式按钮，非头像
            {
                if(!$(this).hasClass('hide')) //未隐藏
                {
                    $(this).hide();
                    $(this).addClass('hide');
                }
            }
        });
 
        $('.ContentItem.ZVideoItem').closest('.TopstoryItem').hide(); //隐藏视频信息流
    }
    else
    {
        $("img").each(function () {
            if ($(this).attr("data-original") != undefined && !$(this).hasClass("comment_sticker")) {
                if ($(this).attr("src") != $(this).attr("data-original"))
                    $(this).attr("src", $(this).attr("data-original"));
            }
        });
    }
}
 
//知乎视频下载功能来自脚本https://greasyfork.org/zh-CN/scripts/39206-%E4%B8%8B%E8%BD%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91
 
function downloadVideo () {
    (async () => {
        if (window.location.host == 'www.zhihu.com') return;
 
        const playlistBaseUrl = 'https://lens.zhihu.com/api/videos/';
        //const videoBaseUrl = 'https://video.zhihu.com/video/';
        const videoId = window.location.pathname.split('/').pop(); // 视频id
        const menuStyle = 'transform:none !important; left:auto !important; right:-0.5em !important;';
        const playerId = 'player';
        const coverSelector = '#' + playerId + ' > div:first-child > div:first-child > div:nth-of-type(2)';
        const controlBarSelector = '#' + playerId + ' > div:first-child > div:first-child > div:last-child > div:last-child > div:first-child';
        const svgDownload = '<path d="M9.5,4 H14.5 V10 H17.8 L12,15.8 L6.2,10 H9.5 Z M6.2,18 H17.8 V20 H6.2 Z"></path>';
        let player = document.getElementById(playerId);
        let resolutionMap = { '标清': 'sd', '高清': 'ld', '超清': 'hd' };
        let videos = []; // 存储各分辨率的视频信息
        let downloading = false;
 
        function getBrowerInfo () {
            let browser = (function (window) {
                let document = window.document;
                let navigator = window.navigator;
                let agent = navigator.userAgent.toLowerCase();
                // IE8+支持.返回浏览器渲染当前文档所用的模式
                // IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
                // IE10:10(兼容模式7||8||9)
                let IEMode = document.documentMode;
                let chrome = window.chrome || false;
                let system = {
                    // user-agent
                    agent: agent,
                    // 是否为IE
                    isIE: /trident/.test(agent),
                    // Gecko内核
                    isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
                    // webkit内核
                    isWebkit: agent.indexOf('webkit') > 0,
                    // 是否为标准模式
                    isStrict: document.compatMode === 'CSS1Compat',
                    // 是否支持subtitle
                    supportSubTitle: function () {
                        return 'track' in document.createElement('track');
                    },
                    // 是否支持scoped
                    supportScope: function () {
                        return 'scoped' in document.createElement('style');
                    },
 
                    // 获取IE的版本号
                    ieVersion: function () {
                        let rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
                        let match = rMsie.exec(agent);
                        try {
                            return match[2];
                        } catch (e) {
                            return IEMode;
                        }
                    },
                    // Opera版本号
                    operaVersion: function () {
                        try {
                            if (window.opera) {
                                return agent.match(/opera.([\d.]+)/)[1];
                            }
                            else if (agent.indexOf('opr') > 0) {
                                return agent.match(/opr\/([\d.]+)/)[1];
                            }
                        } catch (e) {
                            return 0;
                        }
                    }
                };
 
                try {
                    // 浏览器类型(IE、Opera、Chrome、Safari、Firefox)
                    system.type = system.isIE ? 'IE' :
                    window.opera || (agent.indexOf('opr') > 0) ? 'Opera' :
                    (agent.indexOf('chrome') > 0) ? 'Chrome' :
                    //safari也提供了专门的判定方式
                    window.openDatabase ? 'Safari' :
                    (agent.indexOf('firefox') > 0) ? 'Firefox' :
                    'unknow';
 
                    // 版本号
                    system.version = (system.type === 'IE') ? system.ieVersion() :
                    (system.type === 'Firefox') ? agent.match(/firefox\/([\d.]+)/)[1] :
                    (system.type === 'Chrome') ? agent.match(/chrome\/([\d.]+)/)[1] :
                    (system.type === 'Opera') ? system.operaVersion() :
                    (system.type === 'Safari') ? agent.match(/version\/([\d.]+)/)[1] :
                    '0';
 
                    // 浏览器外壳
                    system.shell = function () {
                        if (agent.indexOf('edge') > 0) {
                            system.version = agent.match(/edge\/([\d.]+)/)[1] || system.version;
                            return 'Edge';
                        }
                        // 遨游浏览器
                        if (agent.indexOf('maxthon') > 0) {
                            system.version = agent.match(/maxthon\/([\d.]+)/)[1] || system.version;
                            return 'Maxthon';
                        }
                        // QQ浏览器
                        if (agent.indexOf('qqbrowser') > 0) {
                            system.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || system.version;
                            return 'QQBrowser';
                        }
                        // 搜狗浏览器
                        if (agent.indexOf('se 2.x') > 0) {
                            return '搜狗浏览器';
                        }
 
                        // Chrome:也可以使用window.chrome && window.chrome.webstore判断
                        if (chrome && system.type !== 'Opera') {
                            let external = window.external;
                            let clientInfo = window.clientInformation;
                            // 客户端语言:zh-cn,zh.360下面会返回undefined
                            let clientLanguage = clientInfo.languages;
 
                            // 猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                            if (external && 'LiebaoGetVersion' in external) {
                                return 'LBBrowser';
                            }
                            // 百度浏览器
                            if (agent.indexOf('bidubrowser') > 0) {
                                system.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
                                    agent.match(/chrome\/([\d.]+)/)[1];
                                return 'BaiDuBrowser';
                            }
                            // 360极速浏览器和360安全浏览器
                            if (system.supportSubTitle() && typeof clientLanguage === 'undefined') {
                                let storeKeyLen = Object.keys(chrome.webstore).length;
                                let v8Locale = 'v8Locale' in window;
                                return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                            }
                            return 'Chrome';
                        }
                        return system.type;
                    };
 
                    // 浏览器名称(如果是壳浏览器,则返回壳名称)
                    system.name = system.shell();
                    // 对版本号进行过滤过处理
                    // System.version = System.versionFilter(System.version);
 
                } catch (e) {
                    // console.log(e.message);
                }
 
                return system;
 
            })(window);
 
            if (browser.name == undefined || browser.name == '') {
                browser.name = 'Unknown';
                browser.version = 'Unknown';
            }
            else if (browser.version == undefined) {
                browser.version = 'Unknown';
            }
            return browser;
        }
 
        function fetchRetry (url, options = {}, times = 1, delay = 1000, checkStatus = true) {
            return new Promise((resolve, reject) => {
                // fetch 成功处理函数
                function success (res) {
                    if (checkStatus && !res.ok) {
                        failure(res);
                    }
                    else {
                        resolve(res);
                    }
                }
 
                // 单次失败处理函数
                function failure (error) {
                    times--;
 
                    if (times) {
                        setTimeout(fetchUrl, delay);
                    }
                    else {
                        reject(error);
                    }
                }
 
                // 总体失败处理函数
                function finalHandler (error) {
                    throw error;
                }
 
                function fetchUrl () {
                    return fetch(url, options)
                        .then(success)
                        .catch(failure)
                        .catch(finalHandler);
                }
 
                fetchUrl();
            });
        }
 
        // 下载指定url的资源
        async function downloadUrl (url, name = (new Date()).valueOf() + '.mp4') {
            let browser = getBrowerInfo();
 
            // Greasemonkey 需要把 url 转为 blobUrl
            if (GM_info.scriptHandler == 'Greasemonkey') {
                let res = await fetchRetry(url);
                let blob = await res.blob();
                url = URL.createObjectURL(blob);
            }
 
            // Chrome 可以使用 Tampermonkey 的 GM_download 函数绕过 CSP(Content Security Policy) 的限制
            if (window.GM_download) {
                GM_download({ url, name });
            }
            else {
                // firefox 需要禁用 CSP, about:config -> security.csp.enable => false
                let a = document.createElement('a');
                a.href = url;
                a.download = name;
                // a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
 
                setTimeout(function () {
                    URL.revokeObjectURL(url);
                }, 100);
            }
        }
 
        function humanSize (size) {
            let n = Math.log(size) / Math.log(1024) | 0;
            return (size / Math.pow(1024, n)).toFixed(0) + ' ' + (n ? 'KMGTPEZY'[--n] + 'B' : 'Bytes');
        }
 
        if (!player) return;
 
        // 获取视频信息
        const res = await fetchRetry(playlistBaseUrl + videoId, {
            headers: {
                'referer': 'refererBaseUrl + videoId',
                'authorization': 'oauth c3cef7c66a1843f8b3a9e6a1e3160e20' // in zplayer.min.js of zhihu
            }
        }, 3);
        const videoInfo = await res.json();
 
        // 获取不同分辨率视频的信息
        for (let [key, video] of Object.entries(videoInfo.playlist)) {
            video.name = key;
 
            if (!videos.find(v => v.width == video.width)) {
                videos.push(video);
            }
        }
 
        // 按分辨率大小排序
        videos = videos.sort(function (v1, v2) {
            return v1.width == v2.width ? 0 : (v1.width > v2.width ? 1 : -1);
        }).reverse();
 
        document.addEventListener('DOMNodeInserted', (evt) => {
            let domControlBar = evt.relatedNode.querySelector(':scope > div:last-child > div:first-child');
            if (!domControlBar || domControlBar.querySelector('.download')) return;
 
            let domFullScreenBtn = domControlBar.querySelector(':scope > div:nth-last-of-type(1)');
            let domResolutionBtn = domControlBar.querySelector(':scope > div:nth-last-of-type(3)');
            let domDownloadBtn, defaultResolution, buttons;
            if (!domFullScreenBtn || !domFullScreenBtn.querySelector('button')) return;
 
            // 克隆分辨率菜单或全屏按钮为下载按钮
            domDownloadBtn = (domResolutionBtn && (domResolutionBtn.className == domFullScreenBtn.className)) ? domResolutionBtn.cloneNode(true)
            : domFullScreenBtn.cloneNode(true);
 
            defaultResolution = domDownloadBtn.querySelector('button').innerText;
 
            // 生成下载按钮图标
            domDownloadBtn.querySelector('button:first-child').outerHTML = domFullScreenBtn.cloneNode(true).querySelector('button').outerHTML;
            domDownloadBtn.querySelector('svg').innerHTML = svgDownload;
            domDownloadBtn.className = domDownloadBtn.className + ' download';
 
            buttons = domDownloadBtn.querySelectorAll('button');
 
            // button 元素添加对应的下载地址
            buttons.forEach(dom => {
                let video = videos.find(v => v.name == resolutionMap[dom.innerText || defaultResolution]);
                video = video || videos[0];
                dom.dataset.video = video.play_url;
                if (dom.innerText) {
                    (dom.innerText = `${dom.innerText} (${humanSize(video.size)})`);
                }
                else if (buttons.length == 1) {
                    dom.nextSibling.querySelector('div').innerText = humanSize(video.size);
                }
            });
 
            // 鼠标事件 - 显示菜单
            domDownloadBtn.addEventListener('pointerenter', () => {
                let domMenu = domDownloadBtn.querySelector('div:nth-of-type(1)');
                if (domMenu) {
                    domMenu.style.cssText = menuStyle + 'opacity:1 !important; visibility:visible !important';
                }
            });
 
            // 鼠标事件 - 隐藏菜单
            domDownloadBtn.addEventListener('pointerleave', () => {
                let domMenu = domDownloadBtn.querySelector('div:nth-of-type(1)');
                if (domMenu) {
                    domMenu.style.cssText = menuStyle;
                }
            });
 
            // 鼠标事件 - 选择菜单项
            domDownloadBtn.addEventListener('pointerup', event => {
                if (downloading) {
                    alert('当前正在执行下载任务，请等待任务完成。');
                    return;
                }
 
                let e = event.srcElement || event.target;
 
                while (e.tagName != 'BUTTON') {
                    e = e.parentNode;
                }
 
                downloadUrl(e.dataset.video);
            });
 
            // 显示下载按钮
            domControlBar.appendChild(domDownloadBtn);
 
        });
    })();
}
 
 
function addCSS () {
    var css = 'html[data-theme=dark] .css-1qefhqu{background-color:#1A1A1A}' +
        'html[data-theme=dark] .LeftItem{color:#606A80}' +
        'html[data-theme=dark] .LeftItem:hover{background-color:#F0F2F7!important}' +
        '#nightmode{color:black}' +
        '#nightmode:hover{color:#0084FF}' +
        'html[data-theme=dark] #nightmode{color:hsla(0,0%,100%,.8)}' +
        'html[data-theme=dark] #nightmode:hover{color:#0084FF}' +
        '.Reward{display:none!important}' +
        'html[data-hover-visible] .VoterList-content .List-item:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0.6px 0.4px 0 4px rgba(0,132,255,.3) inset;' +
        '	box-shadow: 0 0 0 2px #fff,0.6px 0.6px 0 4px rgba(0,132,255,.3) inset' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .VoterList-content .List-item:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0.6px 0.4px 0 4px rgba(58,118,208,.6) inset;' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0.6px 0.4px 0 4px rgba(58,118,208,.6) inset' +
        '}' +
        'html[data-hover-visible] .QuestionInvitation .List-item:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 3px rgba(0,132,255,.3) inset;' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 3px rgba(0,132,255,.3) inset' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .QuestionInvitation .List-item:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 3px rgba(58,118,208,.6) inset;' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 3px rgba(58,118,208,.6) inset' +
        '}' +
        'html[data-hover-visible] .List-item .List-item:hover {' +
        '	-webkit-box-shadow: none;' +
        '	box-shadow: none' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .List-item .List-item:hover {' +
        '	-webkit-box-shadow: none;' +
        '	box-shadow: none' +
        '}' +
        'html[data-hover-visible] .List-item:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3);' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3)' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .List-item:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6);' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6)' +
        '}' +
        '' +
        'html[data-hover-visible] .QuestionAnswer-content:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3);' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3)' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .QuestionAnswer-content:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6);' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6)' +
        '}' +
        '' +
        'html[data-hover-visible] .List-item:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3);' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3)' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .List-item:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6);' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6)' +
        '}' +
        'html[data-hover-visible] .QuestionItem.QuestionWaiting-questionItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3);' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3)' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .QuestionItem.QuestionWaiting-questionItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6);' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6)' +
        '}' +
        'html[data-hover-visible] .QuestionItem.ToolsQuestionInvited-questionItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3);' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3)' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .QuestionItem.ToolsQuestionInvited-questionItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6);' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6)' +
        '}' +
        'html[data-hover-visible] .QuestionItem.ToolsQuestionRecommend-questionItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3);' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3)' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .QuestionItem.ToolsQuestionRecommend-questionItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6);' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6)' +
        '}' +
        'html[data-hover-visible] .css-1v8e53u:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3);' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 5px rgba(0,132,255,.3)' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .css-1v8e53u:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6);' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 5px rgba(58,118,208,.6)' +
        '}' +
        'html[data-theme=dark][data-hover-visible] .QuestionItem.css-1ob7sqq {' +
        '   border:none;'+
        '}' +
        'html[data-hover-visible] .QuestionItem.css-1ob7sqq:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 3px rgba(0,132,255,.3) inset;' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 3px rgba(0,132,255,.3) inset; ' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .QuestionItem.css-1ob7sqq:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 3px rgba(58,118,208,.6) inset;' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 3px rgba(58,118,208,.6) inset; ' +
        '}' +
 
        'html[data-hover-visible] .HotItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 3px rgba(0,132,255,.3) inset;' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 3px rgba(0,132,255,.3) inset ' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .HotItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 3px rgba(58,118,208,.6) inset;' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 3px rgba(58,118,208,.6) inset ' +
        '}' +
        'html[data-hover-visible] .Card.TopstoryItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #fff,0 0 0 3px rgba(0,132,255,.3) inset;' +
        '	box-shadow: 0 0 0 2px #fff,0 0 0 3px rgba(0,132,255,.3) inset' +
        '}' +
        '' +
        'html[data-theme=dark][data-hover-visible] .Card.TopstoryItem:hover {' +
        '	-webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 3px rgba(58,118,208,.6) inset;' +
        '	box-shadow: 0 0 0 2px #1a1a1a,0 0 0 3px rgba(58,118,208,.6) inset' +
        '}' +
        'html[data-hover-visible] .Card.TopstoryItem .ContentItem-actions{' +
        '	margin-top: 0px;' +
        '   margin-right: -17px;' +
        '   margin-bottom: -10px;' +
        '   margin-left: -17px;' +
        '   padding-top: 10px;' +
        '   padding-right: 17px;' +
        '   padding-bottom: 10px;' +
        '   padding-left: 17px;' +
        '}' +
        'html[data-hover-visible] .Card.TopstoryItem .ContentItem-actions.is-fixed{' +
        '   margin-top: 0px;' +
        '   margin-right: 0px;' +
        '   margin-bottom: 0px;' +
        '   margin-left: 0px;' +
        '   padding-right: 20px;' +
        '   padding-bottom: 10px;' +
        '   padding-left: 20px;' +
        '}' +
        '.ModalExp-content{' +
        '	display:none!important;' +
        '}' +
        'html .ColumnPageHeader-Menu .Menu-item{color:black}' +
        'html[data-theme=dark] .ColumnPageHeader-Menu .Menu-item{color:hsla(0,0%,100%,.8)}' +
        'html .ColumnPageHeader-Menu .Menu-item.is-active{color:#0084FF}' +
        '.Tabs-link.AppHeader-TabsLink{color:#8590A6}' +
        '.Tabs-link.AppHeader-TabsLink.is-active{color:#0084FF}' +
        'html[data-theme=dark] .Tabs-link.AppHeader-TabsLink.is-active{color:#0084FF}' +
        '.Tabs-link.AppHeader-TabsLink:hover{color:#0084FF}' +
        'html[data-theme=dark] .Tabs-link.AppHeader-TabsLink:hover{color:#0084FF}' +
        'html[data-theme=dark] .QuestionHeader-title{color:#d3d3d3}' +
        'html[data-theme=dark] .QuestionRichText{color:#d3d3d3}' +
        'html[data-theme=dark] .RichContent-inner {color:#d3d3d3}' +
        'html[data-theme=dark] .List-headerText{color:#d3d3d3}' +
        'html[data-theme=dark] .QuestionInvitation-title{color:#d3d3d3}' +
        'html[data-theme=dark] div[itemprop=\"zhihu:question\"]{color:#d3d3d3}' +
        'html[data-theme=dark] .ContentItem-title{color:#d3d3d3}' +
        'html[data-theme=dark] .HotItem-title{color:#d3d3d3}' +
        'html[data-theme=dark] .CommentTopbar-title{color:#d3d3d3!important}' +
        'html[data-theme=dark] .UserLink-link{color:#d3d3d3}' +
        'html[data-theme=dark] .CommentItemV2-content .RichText{color:#d3d3d3}' +
        'html[data-theme=dark] .ExploreHomePage-ContentSection-header{color:#d3d3d3}' +
        'html[data-theme=dark] .ExploreSpecialCard-title{color:#d3d3d3}' +
        'html[data-theme=dark] .ExploreSpecialCard-contentTitle{color:#d3d3d3}' +
        'html[data-theme=dark] .ExploreRoundtableCard-questionTitle{color:#d3d3d3}' +
        'html[data-theme=dark] .ExploreCollectionCard-title{color:#d3d3d3}' +
        'html[data-theme=dark] .ExploreCollectionCard-contentTitle{color:#d3d3d3}' +
        'html[data-theme=dark] .ExploreColumnCard-title{color:#d3d3d3}' +
        'html[data-theme=dark] .ClubItem-name{color:#d3d3d3}' +
        'html[data-theme=dark] .ClubHeaderInfo-name{color:#d3d3d3}' +
        'html[data-theme=dark] .ClubHeaderInfo-description{color:#d3d3d3}' +
        'html[data-theme=dark] .NumberBoard-itemValue{color:#d3d3d3!important}' +
        'html[data-theme=dark] .Tabs-link.ClubTabs{color:#d3d3d3}' +
        'html[data-theme=dark] .ClubTopPosts-title{color:#d3d3d3}' +
        'html[data-theme=dark] .PostItem-headNameText{color:#d3d3d3}' +
        'html[data-theme=dark] .PostItem-titleText{color:#d3d3d3}' +
        'html[data-theme=dark] .PostItem-Title{color:#d3d3d3}' +
        'html[data-theme=dark] .PostItem-Summary{color:#d3d3d3}' +
        'html[data-theme=dark] .LinkCard-title{color:#d3d3d3}' +
        'html[data-theme=dark] .css-bb9ulb{color:#d3d3d3}' +
        'html[data-theme=dark] .CollectionDetailPageHeader-title{color:#d3d3d3}' +
        'html[data-theme=dark] .CollectionsHeader-tabsLink{color:#d3d3d3}' +
        'html[data-theme=dark] .SelfCollectionItem-title{color:#d3d3d3}' +
        'html[data-theme=dark] .Card-headerText{color:#d3d3d3}' +
        'html[data-theme=dark] .Modal-title{color:#d3d3d3}' +
        'html[data-theme=dark] .Favlists-itemNameText{color:#d3d3d3}' +
        'html[data-theme=dark] .ReportMenu-itemValue{color:#d3d3d3}' +
        'html[data-theme=dark] .ShortcutHintModal-hintTitle{color:#d3d3d3}' +
        'html[data-theme=dark] .KeyHint{color:#d3d3d3}' +
        'html[data-theme=dark] .Anonymous-confirm{color:#d3d3d3}' +
        'html[data-theme=dark] .css-sumlaa svg{fill:#d3d3d3}' +
        'html[data-theme=dark] .Post-Title{color:#d3d3d3}' +
        'html[data-theme=dark] .Post-RichTextContainer p{color:#d3d3d3}' +
        'html[data-theme=dark] body{color:#d3d3d3; background:rgb(18,18,18)}' +
        '.QuestionInvitation .Topbar{cursor:pointer;}' +
        'html[data-theme=dark] .WriteIndexLayout-main.WriteIndex{border: 1px solid #222}' +
        'html[data-theme=dark] .zhi{color:#d3d3d3; background-color:rgb(18,18,18)}' +
        '.Zi--FormatBold, .Zi--FormatItalic, .Zi--FormatHeader, .Zi--FormatBlockquote, .Zi--InsertOrderedList, .Zi--InsertUnorderedList, .Zi--InsertReference, .Zi--InsertDivider, .Zi--InsertCatalog {fill: black}' +
        'html[data-theme=dark] .Zi--FormatBold,html[data-theme=dark] .Zi--FormatItalic,html[data-theme=dark] .Zi--FormatHeader,html[data-theme=dark] .Zi--FormatBlockquote,html[data-theme=dark] .Zi--InsertOrderedList,html[data-theme=dark] .Zi--InsertUnorderedList,html[data-theme=dark] .Zi--InsertReference,html[data-theme=dark] .Zi--InsertDivider ,html[data-theme=dark] .Zi--InsertCatalog{fill: #d3d3d3}' +
        '.Zi--Bell path{fill:rgb(68,68,68)}'+
        '.Zi--Comments path{fill:rgb(68,68,68)}' +
        'html[data-theme=dark] .Zi--Bell path{fill:#8590a6}' +
        'html[data-theme=dark] .Zi--Comments path{fill:#8590a6}' +
        '.Zi--Bell:hover path{fill:#FACB62}' +
        '.Zi--Comments:hover path{fill:#00FF7F}' +
        'html[data-theme=dark] .Zi--Bell:hover path{fill:#FACB62}' +
        'html[data-theme=dark] .Zi--Comments:hover path{fill:#00FF7F}' +
        '.CommentItemV2-talkBtn .Zi--Comments path{fill:#8590a6}'+
        'html[data-theme=dark] .CommentItemV2-talkBtn .Zi--Comments path{fill:#8590a6}'+
        '.CommentItemV2-talkBtn:hover .Zi--Comments path{fill:#00FF7F}'+
        'html[data-theme=dark] .CommentItemV2-talkBtn:hover .Zi--Comments path{fill:#00FF7F}'+
        'html[data-theme=dark] .Zi--Browser{fill:#8590A6}'+
        'html[data-theme=dark] .css-w8abe7{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-12qxk2{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-huwkhm{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-akuk2k{background:rgb(18,18,18); border:none}'+
        'html[data-theme=dark] .css-1v8e53u{border: none}'+
        'html[data-theme=dark] .css-k0fmhp{color:#d3d3d3}'+
        'html[data-theme=dark] .css-k0fmhp:hover{color: #6385a6}'+
        'html[data-theme=dark] .css-t3ae3e{color:#d3d3d3}'+
        'html[data-theme=dark] .css-1b3v2ql{color:#d3d3d3;}'+
        'html[data-theme=dark] .css-ke5ir5{color:rgb(133, 144, 166);}'+
        'html[data-theme=dark] .CreatorHomeDeltaCount-compare{color:#d3d3d3}'+
        'html[data-theme=dark] .CreatorHomeAnalyticsData-title{color:#d3d3d3}'+
        'html[data-theme=dark] .CreatorHomeAnalyticsDataItem-type{color:#d3d3d3}'+
        'html[data-theme=dark] .CreatorHomeUpgradeGuide-title{color:#d3d3d3}'+
        'html[data-theme=dark] .Tabs-link {color:#d3d3d3}'+
        'html[data-theme=dark] .CreatorRecruitTitle{color:#d3d3d3!important}'+
        'html[data-theme=dark] .Title-title-3QaE{color:#d3d3d3}'+
        'html[data-theme=dark] .ToolsCopyright-FieldName{color:#d3d3d3}'+
        'html[data-theme=dark] .ToolsCopyright-input{background:#d3d3d3}'+
        'html[data-theme=dark] .Title-main-1ldU{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .Title-border-1vTk{background:#8590a65c}'+
        'html[data-theme=dark] .iframeLive-iframe_live-WojO{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .iframeLive-certifiedWrapper-pfzZ{background:rgb(18,18,18); border: 1px solid #8590a65c}'+
        'html[data-theme=dark] .iframeLive-description-2C6O{background:rgb(18,18,18); border: 1px solid #8590a65c}'+
        'html[data-theme=dark] .iframeLive-explanation-2IxQ{color:#d3d3d3}'+
        'html[data-theme=dark] .iframeLive-what_zhihu_title-1yQe{color:#d3d3d3}'+
        'html[data-theme=dark] .iframeLive-public_number_title-3kRs{color:#d3d3d3}'+
        'html[data-theme=dark] .SettingsFAQ-pageTitle {color:#d3d3d3}'+
        'html[data-theme=dark] .VideoGallery-root-7Z1Ci{background:rgb(18,18,18)!important}'+
        'html[data-theme=dark] .css-17714ul{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-1bwzp6r{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-w215gm{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-ul9l2m{background:rgb(18,18,18);}'+
        'html[data-theme=dark] .css-m1yuwo{border-left: 1px solid #8590a65c}'+
        'html[data-theme=dark] .css-9ytsk0{border-bottom: 1px solid #8590a65c}'+
        'html[data-theme=dark] .css-1pp4h0z{border-top: 1px solid #8590a65c}'+
        'html[data-theme=dark] .css-xevy9w tbody tr:nth-of-type(odd){background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-1dah1m2 .css-wdqmif{background:rgb(18,18,18); border-bottom: 1px solid #8590a65c}'+
        '.RichText .lazy[data-lazy-status=ok]{animation:none;}'+
        'html[data-theme=dark] img{filter: brightness(0.6);}'+
        'html[data-theme=dark] svg:not([class*="Zi"]){filter: brightness(0.6);}'+
        'html[data-theme=dark] .ImageAlias{filter: brightness(0.6);}'+
        'html[data-theme=dark] .ExploreRoundtableCard-headerContainer{filter: brightness(0.6);}'+
        'html[data-theme=dark] .TitleImage{filter: brightness(0.6);}'+
        'html[data-theme=dark] .ecommerce-ad-arrow-img{filter: brightness(0.6);}'+
        'html[data-theme=dark] circle{fill-opacity: 0.6!important;}'+
        'html[data-theme=dark] .GifPlayer-icon{opacity: 0.6!important;}'+
        'html[data-theme=dark] .css-iue0mv{background:#d3d3d3}'+
        '.AppHeaderProfileMenu .Button.Menu-item{color:black}'+
        'html[data-theme=dark] .AppHeaderProfileMenu .Button.Menu-item{color:#d3d3d3}'+
        '.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons .Button--grey.Button--withIcon.Button--withLabel{color: rgb(68, 68, 68);}'+
        '.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons .Button--grey.Button--withIcon.Button--withLabel:hover .Zi--Comments path{fill:#00FF7F}'+
        'html[data-theme=dark] .MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons .Button--grey.Button--withIcon.Button--withLabel{color: #8590A6;}'+
        '.MemberButtonGroup.AnswerAuthor-buttons .Button--grey.Button--withIcon.Button--withLabel{color: rgb(68, 68, 68);}'+
        '.MemberButtonGroup.AnswerAuthor-buttons .Button--grey.Button--withIcon.Button--withLabel:hover .Zi--Comments path{fill:#00FF7F}'+
        'html[data-theme=dark] .MemberButtonGroup.AnswerAuthor-buttons .Button--grey.Button--withIcon.Button--withLabel{color: #8590A6;}'+
        '.ztext sup[data-draft-type=reference] {background:yellow; color:black}'+
        'html[data-theme=dark] .ztext sup[data-draft-type=reference] {background:yellow; color:black}'+
        '.ReferenceList .ReferenceList-backLink{color:#0084ff;}'+
        'html[data-theme=dark] .ReferenceList .ReferenceList-backLink{color:#0084ff;}'+
        '.ReferenceList li{background:white; color:black}'+
        'html[data-theme=dark] .ReferenceList li{background:rgb(18,18,18); color:#d3d3d3}'+
        '.ReferenceList li.is-active{background:yellow; color:black}'+
        'html[data-theme=dark] .ReferenceList li.is-active{background:yellow; color:black}'+
        '.zm-item-tag{color:#0084ff; background:#0084ff1a}'+
        'html[data-theme=dark] .zg-item-log-detail{border-left: 3px solid #d3d3d340;}'+
        'html[data-theme=dark] del{background: #0084ff1a;}'+
        '.zg-item-log-detail ins, .zg-item-log-detail ins a{color:#0084ff; background:#0084ff1a}'+
        '.ReportMenu-inner.ReportMenu-options{margin-bottom:20px}'+
        '.ModalButtonGroup.ModalButtonGroup--horizontal{margin-top:20px}'+
        '.TopstoryItem-actionButton{color:#8590A6}'+
        '.TopstoryItem-actionButton:hover{color:#0084FF}'+
        '.TopstoryItem-uninterestTag{color:#8590A6}'+
        '.TopstoryItem-uninterestTag:hover{color:#0084FF}'+
        'html[data-theme=dark] .TopstoryItem-actionButton{color:#8590A6}'+
        'html[data-theme=dark] .TopstoryItem-actionButton:hover{color:#0084FF}'+
        'html[data-theme=dark] .TopstoryItem-uninterestTag{color:#8590A6}'+
        'html[data-theme=dark] .TopstoryItem-uninterestTag:hover{color:#0084FF}'+
        '.Button.Menu-item{color:#8590A6}' +
        '.Button.Menu-item.is-active{color:black}' +
        'html[data-theme=dark] .Button.Menu-item:is-active{color:#d3d3d3!important}'+
        'html[data-theme=dark] .Post-ActionMenu .Button.Menu-item.Button--plain.is-active{color:#d3d3d3!important}'+
        'html[data-theme=dark] .Post-ActionMenu .Button.Menu-item.Button--plain.is-active .css-17px4ve svg{fill:#d3d3d3!important}'+
        'html[data-theme=dark] .AnswerItem-selectMenuItem.is-active{color:#d3d3d3!important}'+
        'html[data-theme=dark] .AnswerItem-selectMenuItem.is-active .css-17px4ve svg{fill:#d3d3d3!important}'+
        'html[data-theme=dark] .CommentPermission-item.is-active{color:#d3d3d3!important}'+
        'html[data-theme=dark] .CommentPermission-item.is-active .css-17px4ve svg{fill:#d3d3d3!important}'+
        '.ToolsQuestion-header--action{color:#0084FF}'+
        'html[data-theme=dark] .ToolsQuestion-header--action{color:#0084FF}'+
        'html[data-theme=dark] .Button.css-jamz70{color:white; border:none}'+
        'html[data-theme=dark] .css-l0zkw9{color:#8590A6}'+
        '.SettingsNav-link[href="/settings/mcn"]{display:none!important}'+
        '.SettingsNav-link{color:black}'+
        'html[data-theme=dark] .SettingsNav-link{color:#d3d3d3}'+
        'html[data-theme=dark] .SettingsNav-link .Zi--Bell path{fill:#d3d3d3}'+
        '.SettingsNav-link.is-active{color:#0084ff}'+
        '.SettingsNav-link.is-active svg{fill:#0084ff}'+
        '.SettingsNav-link.is-active .Zi--Bell path{fill:#0084ff}'+
        'html[data-theme=dark] .SettingsNav-link.is-active{color:#0084ff}'+
        'html[data-theme=dark] .SettingsNav-link.is-active svg{fill:#0084ff}'+
        'html[data-theme=dark] .SettingsNav-link.is-active .Zi--Bell path{fill:#0084ff}'+
        '.SettingsNav-link:hover {color:#0084ff}'+
        '.SettingsNav-link:hover svg {fill:#0084ff}'+
        '.SettingsNav-link:hover .Zi--Bell path{fill:#0084ff}'+
        'html[data-theme=dark] .SettingsNav-link:hover{color:#0084ff}'+
        'html[data-theme=dark] .SettingsNav-link:hover svg{fill:#0084ff}'+
        'html[data-theme=dark] .SettingsNav-link:hover .Zi--Bell path{fill:#0084ff}'+
        '.Zi--InsertTable{fill:#0084ff}'+
        '.Zi--TableRowNum{fill:#0084ff}'+
        '.Zi--TableColumnNum{fill:#0084ff}'+
        '.ReportMenu-item:hover { background: #8080801c;}'+
        '.ReportInfringement-item:hover { background: #0084ff26;}'+
        '.css-520aav{display:none!important;}'+
        '#nightmode img{filter: brightness(1);!important}'+
        'html[data-theme=dark] .QuestionTopicReviewCardExtraInfo-cardTitle{color:#d3d3d3}'+
        'html[data-theme=dark] .MCNLinkCard-title{color:#d3d3d3}'+
        'html[data-theme=dark] .label-input-label{background-color: #e1eaf2;}'+
        'div.ModalButtonGroup.ModalButtonGroup--horizontal > button:nth-child(1):not([class="ReportMenu-button"]):hover{background: #8080801c;}'+
        '.Modal:not([class*="BaiduFileSelector"]) .Modal-inner{overflow-y:hidden}'+
        '.Modal-content{overflow-y:hidden}'+
        '.BaiduFileSelector-content{overflow-y:none}'+
        'html[data-theme=dark] .TopTabNavBar-isLight-bYRj{background:rgb(18,18,18)!important}'+
        'html[data-theme=dark] .Card-card-2K6v{background:rgb(18,18,18); }'+
        'html[data-theme=dark] .LiveItem-title-2qes{color:#d3d3d3}'+
        'html[data-theme=dark] .GlobalSidebar-introItem-24PB h3{color:#d3d3d3}'+
        'html[data-theme=dark] .Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .UserLivesPage-page-GSje{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .Menu-menuInner-2eRf{background:rgb(18,18,18)}'+
        '.Menu-menuItem-1oId:hover{background:#8080801c}'+
        'html[data-theme=dark] .Menu-menuItem-1oId:hover{background:#8080801c}'+
        'html[data-theme=dark] .EditorAttachment{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-ovbogu{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .AppHeader{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .PubIndex-CategoriesHeader{background:rgb(26,26,26);border:none}'+
        'html[data-theme=dark] .BottomBar-wrapper-kXb19{background:rgb(18,18,18)!important}'+
        'html[data-theme=dark] .css-1cs7y3i{color:#d3d3d3}'+
        'html[data-theme=dark] .TabNavBarItem-tab-MS9i{color:#d3d3d3}'+
        'html[data-theme=dark] .TabNavBarItem-tab-MS9i.TabNavBarItem-isActive-1iXL{color: rgb(17, 133, 254);}'+
        '.ToolsQuestionInvited-questionList{padding: 0px 20px 20px 20px}'+
        'html[data-theme=dark] .FeedbackButton-button-3waL{background:#d3d3d3}'+
        'html[data-theme=dark] .Pub-reader-clear-body{background: #000; color:#000}'+
        'html[data-theme=dark] .Pub-reader-body{background: #000; color:#000}'+
        'html[data-theme=dark] .Pub-reader-app-header{background: rgb(18,18,18); border-bottom: 1px solid #444;}'+
        'html[data-theme=dark] .Pub-reader-app-header .reader-nav{background: rgb(18,18,18);}'+
        'html[data-theme=dark] .Pub-reader-bottom-bar{background: rgb(18,18,18);}'+
        'html[data-theme=dark] .Pub-reader-bottom-bar .reader-app-qrcode{color:#d3d3d3;}'+
        'html[data-theme=dark] .Pub-web-reader .Pub-reader-guidance.pc{background: rgb(18,18,18);}'+
        'html[data-theme=dark] .Pub-web-reader .reader-container{background: rgb(0,0,0);}'+
        'html[data-theme=dark] .Pub-web-reader .reader-chapter-content{background: rgb(33,33,35);}'+
        'html[data-theme=dark] .reader-chapter-content{background: rgb(33,33,35); color:rgb(115,118,125)}'+
        'html[data-theme=dark] .Pub-web-reader .reader-chapter-content .MPub-reader-trial-finish{color:#d3d3d3}'+
        'html[data-theme=dark] .Pub-PageHeaderWrapper .PageHeader{background: rgb(18,18,18);}'+
        'html[data-theme=dark] .Pub-BookInfo h1{color:#d3d3d3}'+
        'html[data-theme=dark] .Overview .left{color:#d3d3d3}'+
        'html[data-theme=dark] .reviewHeader div{color:#d3d3d3}'+
        'html[data-theme=dark] .ReviewCell .content{color:gray}'+
        'html[data-theme=dark] .TopNavBar-root{background: rgb(18,18,18); border:none}'+
        'html[data-theme=dark] .TopNavBar-logout{color:#d3d3d3}'+
        'html[data-theme=dark] .Main{background: rgb(18,18,18);}'+
        'html[data-theme=dark] .Pub-BookInfo .Label{color: #0084ff;background: #0084ff1a;}'+
        'html[data-theme=dark] .Labels-labelButton-ioRsP {color: #0084ff;background: #0084ff1a;}'+
        'html[data-theme=dark] .PubBook-RelativeListItem-info{color:#8590A6}'+
        'html[data-theme=dark] .PubIndex-book-main .Summary .TabContent .Description{color:#8590A6}'+
        'html[data-theme=dark] .Pub-BookAuthorItem .AuthorName{color:#d3d3d3}'+
        'html[data-theme=dark] .PubIndex-book-main .Summary .TabContent .ShortDesc{color:#d3d3d3}'+
        'html[data-theme=dark] .css-k7kepf{color:#d3d3d3}'+
        'html[data-theme=dark] .App-root-63J6a{border:1px solid #444}'+
        'html[data-theme=dark] .Pub-reader-app-header .reader-nav li:after{background: #444}'+
        'html[data-theme=dark] .Pub-reader-app-header .reader-logo span:before{background: #444}'+
        'html[data-theme=dark] .Pub-web-reader .Pub-reader-catalogue li{border-bottom:1px solid #444}'+
        'html[data-theme=dark] .Pub-web-reader .Pub-reader-catalogue:before{background: #444}'+
        'html[data-theme=dark] .css-lcfru7, html[data-theme=dark] .css-xnl4yp {border-bottom:1px solid #444}'+
        'html[data-theme=dark] .zm-topic-topbar{border-bottom:1px solid #444}'+
        'html[data-theme=dark] .SelfCollectionItem-innerContainer{border-bottom:1px solid #444}'+
        'html[data-theme=dark] .zm-item+.zm-item{border-top:1px solid #444}'+
        'html[data-theme=dark] .zh-footer .content{border-top:1px solid #444}'+
        'html[data-theme=dark] .zm-side-section+.zm-side-section>.zm-side-section-inner{border-top:1px solid #444}'+
        'html[data-theme=dark] .zg-btn-white.zu-button-more{background: rgb(18,18,18); color:#3a76d0!important; border-color:#3a76d0; box-shadow:none; text-shadow:none}'+
        'html[data-theme=dark] .css-r9mkgf{background: rgb(18,18,18);}'+
        'html[data-theme=dark] .css-jwse5c, html[data-theme=dark] .css-1zcaix, html[data-theme=dark] .css-4a3k6y, html[data-theme=dark] .css-eonief{color:#d3d3d3;}'+
        'html[data-theme=dark] .css-hd7egx{color:#d3d3d3; border-color:#444}'+
        'html[data-theme=dark] .css-1fnir59, html[data-theme=dark] .css-t3f0zn, html[data-theme=dark] .css-1cj0s4z{background: rgb(18,18,18);}'+
        'html[data-theme=dark] .Pub-BookVipEntrance{filter: brightness(0.6);}'+
        'html[data-theme=dark] div.css-1b0ypf8 > div.css-1sqjzsk > div.css-tr5tvs > img{filter: brightness(1);}'+
        'html[data-theme=dark] .ColumnHomeTop:before{background:none}'+
        'html[data-theme=dark] .ColumnHomeBottom{background:none}'+
        'html[data-theme=dark] .HybridLink.Home-topic{cursor:pointer}'+
        'html[data-theme=dark] .WikiLandingWelcome-main h2{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingExcellentItems-title{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingExcellentItems-calcWrapper .WikiLandingExcellentItems-name{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingItemCard-title{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingGuide-title{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingCarousel-author .UserLink-link{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingContributor-title{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingRight-title{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingRight-right .WikiLandingRight-name{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingEditBoard-title{color:#d3d3d3}'+
        'html[data-theme=dark] .WikiLandingNavSelector-navItem{color:#d3d3d3}'+
        'html[data-theme=dark] .BalanceDashboard-Currency-Number{color:#d3d3d3}'+
        'html[data-theme=dark] .BalanceDashboard h1{color:#d3d3d3}'+
        'html[data-theme=dark] .BalanceDashboard-Currency-Label{color:#d3d3d3}'+
        'html[data-theme=dark] .ClubSliderList-name{color:#d3d3d3}'+
        'html[data-theme=dark] .BalanceTransactionList-Item:nth-child(2n) {background-color: hsla(0, 0%, 97%, 0.03);}'+
        '.WikiLandingNavSelector-navItem--active, html[data-theme=dark] .WikiLandingNavSelector-navItem--active{color: #5868d1;}'+
        'html[data-theme=dark] .WikiLandingGuide-wiki .WikiLandingGuide-image{filter: brightness(0.6);}'+
        'html[data-theme=dark] .WikiLandingGuide-abstract .WikiLandingGuide-image{filter: brightness(0.6);}'+
        'html[data-theme=dark] ._Coupon_intro_1kIo{filter: brightness(0.6);}'+
        'html[data-theme=dark] ._Coupon_item_34n9{filter: brightness(0.6);}'+
        'html[data-theme=dark] .Community-ContentLayout{background:black}'+
        'html[data-theme=dark] .css-dainun{background:rgb(18,18,18); border-bottom:1px solid #444}'+
        'html[data-theme=dark] .css-1t8cvcr{border-right:1px solid #444}'+
        'html[data-theme=dark] .css-104x2kz{ border-bottom:1px solid #444;}'+
        'html[data-theme=dark] .css-16kxzh3{ border-bottom:1px solid #444; border-left:1px solid #444}'+
        'html[data-theme=dark] .css-18xitnw{ border-top:1px solid #444;}'+
        'html[data-theme=dark] .css-11v4451{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-m9gn5f{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-cmuys0{color:#d3d3d3}'+
        'html[data-theme=dark] .css-14chytt{color:#d3d3d3}'+
        'html[data-theme=dark] .css-1hhi6j5{color:#d3d3d3}'+
        'html[data-theme=dark] .css-1d7g4vp{color:#d3d3d3}'+
        'html[data-theme=dark] .css-1c4skpi{color:#d3d3d3; border-bottom:1px solid #444;}'+
        'html[data-theme=dark] .css-yu9w3k{color:#d3d3d3; border-bottom:1px solid #444;}'+
        'html[data-theme=dark] .css-1117lk0:hover .css-yu9w3k{color: rgb(68, 68, 68); border:none}'+
        'html[data-theme=dark] .css-m9gn5f:hover{background-color: rgb(246, 246, 246);}'+
        'html[data-theme=dark] .css-m9gn5f:hover .css-yu9w3k{background-color: rgb(246, 246, 246);color: rgb(68, 68, 68); border:none}'+
        'html[data-theme=dark] .AbstractCard-header:after,html[data-theme=dark] .AbstractCard-header:before{opacity: 0.1}'+
        'html[data-theme=dark] .css-gvm7n2::before {    background-image: linear-gradient(to right, #0084ff00, #0084ffd4);}'+
        'html[data-theme=dark] .css-gvm7n2{color: #f6f6f6;background: #0084ffd4;}'+
        'html[data-theme=dark] .css-1dz0u0s{background: #d3d3d3;}'+
        'html[data-theme=dark] .community-copyright-form input,html[data-theme=dark] .community-copyright-form textarea{background: #ddd;}'+
        'html[data-theme=dark] ._Slogan_sloganWrapper_2E5y{background: #d3d3d3;}'+
        'html[data-theme=dark] .CopyrightSettings h2{color: #d3d3d3;}'+
        'html[data-theme=dark] .CopyrightSettings-setall-tip{color: #d3d3d3;}'+
        'html[data-theme=dark] .community-copyright-form .copies-item-add-button .text{color: #d3d3d3;}'+
        'html[data-theme=dark] .sprite-community-copyright,html[data-theme=dark] [class*=sprite-community-copyright-]{border:none; border-radius:16px;}'+
        'html[data-theme=dark] .tab-navs{border-bottom: 1px solid #444}'+
        'html[data-theme=dark] .community-copyright-faq dt:first-child{border-top: 1px solid #444}'+
        'html[data-theme=dark] .community-copyright-faq dt{border-bottom: 1px solid #444}'+
        'html[data-theme=dark] .css-19mtex{border-top: 1px solid #444}'+
        '.AdblockBanner{display:none!important}'+
        '._7akbfp{color:white!important}'+
        'html[data-theme=dark] #player{filter: brightness(0.6);}'+
        'html[data-theme=dark] .PubIndex-book-main .BasicInfo .Actions{border-top: 1px solid #444;}'+
        'html[data-theme=dark] .PubIndex-book-main .Summary .TabContent .ToggleCollapse{border-top: 1px solid #444;}'+
        'html[data-theme=dark] .ReviewCell{border-top: 1px solid #444;}'+
        'html[data-theme=dark] .PubIndex-book-aside .ToggleCollapse{border-top: 1px solid #444;}'+
        'html[data-theme=dark] .PubIndex-book-main .Summary .TabContent .ExtInfo{border-top: 1px solid #444;}'+
        'html[data-theme=dark] .PubIndex-book-main .Summary .MPub-reader-chapter li{border-bottom-color:#444}'+
        'html[data-theme=dark] .PubIndex-book-main .Summary .MPub-reader-chapter li:hover span{color:#404040}'+
        'html[data-theme=dark] .PubIndex-book-main .Summary .MPub-reader-chapter li.level-1:before{background:#d3d3d3}'+
        'html[data-theme=dark] .PubIndex-book-main .Summary .MPub-reader-chapter li.level-1:hover:before{background:#404040}'+
        'html[data-theme=dark] .PubIndex-book-aside .ToBePublisher .Link{color:#404040}'+
        'html[data-theme=dark] .PubAsideNavs .NavItem:after{background:rgb(26,26,26)}'+
        'html[data-theme=dark] .Pub-web-reader .Pub-reader-guidance h3 span.title{color:#bfbfbf}'+
        'html[data-theme=dark] .Pub-web-reader .Pub-reader-guidance .operation-names{color:#bfbfbf}'+
        'html[data-theme=dark] .CornerButton{background: #1a1a1a;}'+
        '.CornerButton .Zi--BackToTop{fill:#8590A6;}'+
        '.CornerButton:hover .Zi--BackToTop{fill:#0084FF;}'+
        '.CornerButton:hover .Zi--BackToTop:hover{fill:#0084FF;}'+
        'html[data-theme=dark] .CornerButton .Zi--BackToTop{fill:#8590A6;}'+
        'html[data-theme=dark] .CornerButton:hover .Zi--BackToTop{fill:#0084FF;}'+
        'html[data-theme=dark] .CornerButton:hover .Zi--BackToTop:hover{fill:#0084FF;}'+
        'html[data-theme=dark] .Main header{border-bottom: 1px solid #444;}'+
        'html[data-theme=dark] .Main .params section{border-bottom: 1px solid #444;}'+
        'html[data-theme=dark] .App-root-fNRdG{border: 1px solid #444;}'+
        'html[data-theme=dark] .Popover-content-fGkPm.Bubble-content-fdv1v{border: none!important;}'+
        'html[data-theme=dark] .SignFlowHomepage{filter:brightness(0.6);}'+
        'html[data-theme=dark] .css-zvnmar{background:rgb(18,18,18);}'+
        'html[data-theme=dark] .css-1pk3pp1{background:rgb(18,18,18);}'+
        'html[data-theme=dark] .SignFlow-captchaContainer.Captcha-chinese{background:rgb(18,18,18);}'+
        'html[data-theme=dark] .SignContainer-inner{background:rgb(18,18,18);}'+
        'html[data-theme=dark] .Login-socialLogin{background:rgb(18,18,18);}'+
        'html[data-theme=dark] .SignContainer-content input{background:rgb(18,18,18)!important; color:white!important}'+
        'html[data-theme=dark] .css-1vs8y1g{border-top: 1px solid #444;}'+
        'html[data-theme=dark] .ZVideoLinkCard-title{color:#d3d3d3}'+
        'html[data-theme=dark] .ZVideo-title{color:#d3d3d3}'+
        'html[data-theme=dark] .LinkCard-title{color:#d3d3d3}'+
        'html[data-theme=dark] .ecommerce-ad-arrow-main-content-des span{color:#d3d3d3!important}'+
        'html[data-theme=dark] .ArticleLinkCard-title{color:#d3d3d3}'+
        'html[data-theme=dark] .ProfileHeader-detail{color:#d3d3d3}'+
        'html[data-theme=dark] .BlockTitle{color:#d3d3d3}'+
        'html[data-theme=dark] .FormulaModal-formula img{filter: invert(1);}'+
        'html[data-theme=dark] .MCNLinkCard-price{color:#ff7955cc}'+
        'html[data-theme=dark] .MCNLinkCard-button{color:#ff7955cc}'+
        'html[data-theme=dark] .css-10rt8mt{background: #D3D3D3} '+
        'html[data-theme=dark] .css-j3ksul{color: #D3D3D3} '+
        'html[data-theme=dark] .css-13ry121{color: #D3D3D3} '+
        'html[data-theme=dark] .css-17sk48h{background: #D3D3D3} '+
        'html[data-theme=dark] .css-6pi7dw{background: #D3D3D3} '+
        'html[data-theme=dark] .css-1djl0i{color: #D3D3D3} '+
        'html[data-theme=dark] .css-ya4ahl{color: #D3D3D3} '+
        'html[data-theme=dark] .css-rpq3do{background: #D3D3D3} '+
        'html[data-theme=dark] .css-1fod326{background: #D3D3D3} '+
        'html[data-theme=dark] .css-1lywtmg{color: #D3D3D3} '+
        'html[data-theme=dark] .css-1sxqbyv{color: #D3D3D3} '+
        'html[data-theme=dark] .css-noi2nm{background: #f6f6f699} '+
        'html[data-theme=dark] .OpenInAppButton{display:none!important}'+
        'html[data-theme=dark] .css-1rmxt0r{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-17cflso{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-148dlpw{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-pxupqe{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-u6lvao{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-u6lvao:before{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-u6lvao:after{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-i6cwu4{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .Section-title-6pXgn{color: #D3D3D3} '+
        'html[data-theme=dark] .NewVipJointCard-info-kVD8s{color: #D3D3D3;} '+
        'html[data-theme=dark] .SectionTitle-title-hm9BX{color: #D3D3D3} '+
        'html[data-theme=dark] .OtherPrivileges-vipPrivilegeItem-2wWQh .OtherPrivileges-title-5TbKp{color: #D3D3D3} '+
        'html[data-theme=dark] .App-vipCard-smjUr{filter: brightness(0.6);}'+
        'html[data-theme=dark] .App-rightsTitle-mSEk4{color: #D3D3D3} '+
        'html[data-theme=dark] .App-vipBookItem-cdBqb{color: #D3D3D3} '+
        'html[data-theme=dark] .App-contentRightsItem-8pbnH{color: #D3D3D3} '+
        'html[data-theme=dark] .App-activityItem-9ttFQ{color: #D3D3D3} '+
        'html[data-theme=dark] .AlbumColumnMagazineWebPage-title-wN4vV{color: #D3D3D3} '+
        'html[data-theme=dark] .Tabs-tab-rmJ5e.Tabs-active-modB7{color: #D3D3D3} '+
        'html[data-theme=dark] .Section-title-pJASK{color: #D3D3D3} '+
        'html[data-theme=dark] .Contents-chapterCommonTitle-ss2nC{color: #D3D3D3} '+
        'html[data-theme=dark] .ChapterCard-title-wFeeZ{color: #D3D3D3} '+
        'html[data-theme=dark] .SkuCell-title-bHvuZ{color: #D3D3D3} '+
        'html[data-theme=dark] .css-14mfnik{background: rgb(27, 27, 27)} '+
        'html[data-theme=dark] .GifPlayer.isPlaying .GifPlayer-icon{opacity: 0!important}'+
        'html[data-theme=dark] .GifPlayer.isPlaying .GifPlayer-gif2mp4{filter:brightness(0.6)}'+
        'html[data-theme=dark] .GifPlayer.isPlaying .GifPlayer-gif2mp4+img{opacity: 0!important}'+
        'html[data-theme=dark] .css-1sry9ao{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-b1npk4{color: #D3D3D3} '+
        'html[data-theme=dark] .css-1stnbni:hover .css-b1npk4{color: black}'+
        'html[data-theme=dark] .VersatileModuleRenderer-module-kEzfc .VersatileModuleRenderer-skuTitle-mDcPo{color: #D3D3D3} '+
        'html[data-theme=dark] .CreatorRecruitHeader-title{color: #D3D3D3!important} '+
        'html[data-theme=dark] .css-1b1irul{filter:brightness(0.6)}'+
        'html[data-theme=dark] .css-125jmqu{filter:brightness(0.6)}'+
        'html[data-theme=dark] .css-1y2wwyj{filter:brightness(0.6)}'+
        'html[data-theme=dark] .css-1xxg9xm{color: #0084FF} '+
        'html[data-theme=dark] .css-uq88u1{color: #d3d3d3} '+
        'html[data-theme=dark] .css-dh57eh{color: #d3d3d3} '+
        'html[data-theme=dark] .css-1j6wofp{color: #d3d3d3} '+
        'html[data-theme=dark] .css-jwu58x{color: #d3d3d3} '+
        'html[data-theme=dark] .css-1851dda{color: #d3d3d3} '+
        'html[data-theme=dark] .css-1yhwbu2{color: #d3d3d3} '+
        'html[data-theme=dark] .css-1xg9zz8{color: #d3d3d3} '+
        'html[data-theme=dark] .css-147d5r2{color: #d3d3d3} '+
        'html[data-theme=dark] .css-103ktxc{color: #d3d3d3} '+
        'html[data-theme=dark] .css-sfliv9{color: rgb(153, 153, 153);} '+
        'html[data-theme=dark] .css-jt1vdv{border-bottom: 1px solid #d3d3d3; border-color:#d3d3d3} '+
        'html[data-theme=dark] .css-1da4iq8{background:rgb(18,18,18); border:1px solid #2e2e2e}'+
        'html[data-theme=dark] .css-oqge09{background:rgb(18,18,18); border:1px solid #2e2e2e}'+
        'html[data-theme=dark] .css-1s46lii{background:rgb(18,18,18);}'+
        'html[data-theme=dark] .KfeCollection-GoodsCardV2-detail-title{color:#d3d3d3}'+
        'html[data-theme=dark] .KfeCollection-GoodsCardV2-cover-label{color:black}'+
        'html[data-theme=dark] .ColumnMagazineWeb-newBottomBar-idP5i{background:rgb(18,18,18); border-top:1px solid  #2e2e2e}'+
        'html[data-theme=dark] svg.NewBottomBar-defaultColor-3FMr6:not([class*="NewBottomBar-active-hvaTK"]){filter:invert(1) brightness(0.6)}'+
        'html[data-theme=dark] .HeaderInfo-root-gnEfo{filter: brightness(0.6)}'+
        'html[data-theme=dark] .AuthorsSection-headerTitle-xjzpp{color:#d3d3d3}'+
        'html[data-theme=dark] .CatalogModule-title-sggN4{color:#d3d3d3}'+
        'html[data-theme=dark] a.UserCell-link-hyWMo{color:#d3d3d3}'+
        'html[data-theme=dark] .MyShelf-title-qA1gu{color:#d3d3d3}'+
        'html[data-theme=dark] .RecommendFeed-title-x2nEt{color:#d3d3d3}'+
        'html[data-theme=dark] .RecommendFeed-skuTitle-otRGK{color:#d3d3d3!important}'+
        'html[data-theme=dark] .MemberInfoPanel-userName-boKER{color:#d3d3d3!important}'+
        'html[data-theme=dark] .TopNavBar-inner-baxks .TopNavBar-tab-hBAaU a{color:#d3d3d3}'+
        '.TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f{color:#0084ff}'+
        'html[data-theme=dark] .TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f{color:#0084ff}'+
        'html[data-theme=dark] .RankingList-header-eSGqm .RankingList-tabList-usmMt .RankingList-tabItem-pTnCd{color:#d3d3d3}'+
        'html[data-theme=dark] .RankingList-header-eSGqm .RankingList-tabList-usmMt .RankingList-tabItem-pTnCd.RankingList-active-mh1YB{color:#ce994f}'+
        'html[data-theme=dark] .RankingList-header-eSGqm .RankingList-tabList-usmMt .RankingList-title-nDS4G{color:#d3d3d3}'+
        'html[data-theme=dark] .RankingList-skuItem-hpJpz .RankingList-title-nDS4G{color:#d3d3d3}'+
        'html[data-theme=dark] .RankingList-skuItem-hpJpz .RankingList-author-fH328{color:#d3d3d3}'+
        'html[data-theme=dark] .SaltItem-title-th5Li{color:#d3d3d3}'+
        'html[data-theme=dark] .ShelfCell-title-bztZM{color:#d3d3d3}'+
        '.TopNavBar-root-hektz .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Bell path{fill:#d3d3d3}'+
        '.TopNavBar-root-hektz .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Comments path{fill:#d3d3d3}'+
        '.TopNavBar-root-hektz.TopNavBar-fixMode-29iHi .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Bell path{fill:black}'+
        '.TopNavBar-root-hektz.TopNavBar-fixMode-29iHi .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Comments path{fill:black}'+
        'html[data-theme=dark] .TopNavBar-root-hektz.TopNavBar-fixMode-29iHi .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Bell path{fill:#8590A6}'+
        'html[data-theme=dark] .TopNavBar-root-hektz.TopNavBar-fixMode-29iHi .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Comments path{fill:#8590A6}'+
        'html[data-theme=dark] .RankingList-root-ontG8{background:rgb(18,18,18)}'+
        'html[data-theme=dark] .ProductCell-title-ar7kK{color:#d3d3d3}'+
        'html[data-theme=dark] .ProductItemVertical-title-7SkbW{color:#d3d3d3}'+
        'html[data-theme=dark] .LiveAppointmentItem-title-djRgc{color:#d3d3d3}'+
        'html[data-theme=dark] .CoverStory-bigTitle-r5fk8{color:#d3d3d3}'+
        'html[data-theme=dark] .CarouselBanner-leftTurnPageBtn-jxet9, html[data-theme=dark] .CarouselBanner-rightTurnPageBtn-gFDYQ{color:#d3d3d3}'+
        'html[data-theme=dark] .css-1v0m2e8{color:#d3d3d3}'+
        'html[data-theme=dark] .MyShelf-bookCell-d1F4t .MyShelf-bookInfo-rXqus .MyShelf-bookTitle-sYXGP{color:#d3d3d3}'+
        'html[data-theme=dark] .SuperStarList-title-iem6E{color:#d3d3d3}'+
        'html[data-theme=dark] .SuperStarList-starCell-b5kon.SuperStarList-active-fqY4e .SuperStarList-name-fXz2f{color:#d3d3d3}'+
        'html[data-theme=dark] .SuperStarList-starCell-b5kon .SuperStarList-name-fXz2f:hover{color:#d3d3d3}'+
        'html[data-theme=dark] .MenuBar-root-v61Qh{border-bottom:10px solid rgb(18,18,18)}'+
        '.Card.css-8z7gkt{display:none!important;}'+
        'html[data-theme=dark] .ManuscriptTitle-root-vhZzG{color:#d3d3d3}'+
        'html[data-theme=dark] .ProductCardNew-title-7X4Ff{color:#d3d3d3}'+
        'html[data-theme=dark] .TopNavBar-inner-baxks .TopNavBar-searchBar-wM9EY .TopNavBar-searchBtn-n4UgZ{filter:brightness(0.9)}'+
        'html[data-theme=dark] .MemberInfoPanel-info-fqJU8 .MemberInfoPanel-memberBtn-9B2nK{filter:brightness(0.9)}'+
        '.Tabs-link.AppHeader-TabsLink{color:black}'+
        'html[data-theme=dark] .css-1pwpt4d{color:#d3d3d3}'+
        'html[data-theme=dark] .css-piu9of{color:#d3d3d3}'+
        'html[data-theme=dark] .css-rk0pq{color:#d3d3d3}'+
        'html[data-theme=dark] .css-p8hfce{color:#d3d3d3}'+
        'html[data-theme=dark] .css-kwnxmp{color:#d3d3d3}'+
        'html[data-theme=dark] .css-bc6idi{color:#d3d3d3}'+
        'html[data-theme=dark] .css-8u7moq{color:#d3d3d3}'+
        'html[data-theme=dark] .css-c0lyvn{color:#d3d3d3}'+
        'html[data-theme=dark] .css-1204lgo{color:#d3d3d3}'+
        'html[data-theme=dark] .css-17t0kok{color:#8590a6}'+
        'html[data-theme=dark] .css-1xegbra{background-color:#d3d3d3}'+
        'html[data-theme=dark] .css-80i0x3{background-color:#d3d3d3}'+
        'html[data-theme=dark] .css-1akafz2{background-color:#d3d3d3}'+
        'html[data-theme=dark] .css-16zrry9{background-color:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-ygii7h{background-color:rgb(18,18,18)}'+
        'html[data-theme=dark] .css-1f47p0s{border-bottom:1px solid #444}'+
        'html[data-theme=dark] .css-19rbssv{border-bottom:1px solid #444}'+
        'html[data-theme=dark] .css-wooxo5 + .CreationManage-CreationCard{border-top:1px solid #444}'+
        'html[data-theme=dark] .css-90w7z{border-color: #444}'+
        'html[data-theme=dark] .SkuTitle-skuTitleText-iVc91{color:#d3d3d3!important}'+
        'html[data-theme=dark] .GalleryCell-title-38fBA{color:#d3d3d3!important}'+
        'html[data-theme=dark] .GalleryCell-footer-h9wzn{color:#d3d3d3!important}'+
        'html[data-theme=dark] .VideoMask-duration-2dQ3k{color:#d3d3d3!important}'+
        '.MemberButtonGroup.ProfileButtonGroup.HoverCard-buttons .Button--grey:hover .Zi--Comments path{fill:rgb(0,255,127)}'+
        'html[data-theme=dark] .PushNotifications-item{color:#d3d3d3!important}'+
        'html[data-theme=dark] .Messages-item{color:#d3d3d3}'+
        'html[data-theme=dark] .Messages-myMessageTab{color:#d3d3d3}'+
        'html[data-theme=dark] .Messages-myMessageTab:hover{color:#d3d3d3}'+
        'html[data-theme=dark] .ChatBoxModal-closeIcon{fill:#d3d3d3}'+
        '.Notifications-footer > a:nth-child(2):hover{color:#0084ff}'+
        'html[data-theme=dark] .Notifications-Main>header h1{color:#d3d3d3}'+
        'html[data-theme="dark"] .Notifications-Section-header h2{color:#d3d3d3}'+
        'html[data-theme=dark] .NotificationList-Item-content{color:#d3d3d3}'+
        '.Messages-footer .Button:hover{color:#0084ff!important}'+
        'html[data-theme=dark] .css-zprod6 {'+
        '    box-sizing: border-box;'+
        '    margin: 0;'+
        '    min-width: 0;'+
        '    border-radius: 6px;'+
        '    position: absolute;'+
        '    width: 242px;'+
        '    height: 242px;'+
        '    top: 62px;'+
        '    left: 174px;'+
        '    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);'+
        '    background-image: linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.5));'+
        '}';
 
 
 
 
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
 
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    }
    else {
        style.appendChild(document.createTextNode(css));
    }
 
    head.appendChild(style);
}
 
//话题页
function topic () {
    if (hideTopicSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".ContentLayout-sideColumn").hide();
        $(".ContentLayout-mainColumn").width($(".ContentLayout").width());
    }
    else if (hideTopicSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".ContentLayout-sideColumn").hide();
        $(".ContentLayout").attr("style", "display:flex;justify-content:center;");
    }
}
 
//草稿页
function draft(){
    if (hideDraftSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $('.GlobalSideBar').hide();
        $(".DraftList-mainColumn").width($(".DraftList").width());
    }
    else if (hideDraftSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $('.GlobalSideBar').hide();
        $(".DraftList").attr("style", "display:flex;justify-content:center;");
    }
}
 
//知乎圆桌页
function roundtable(){
    //增加遮罩层
    if($('html[data-theme=dark] .css-zprod6').length==0)
    {
        $('html[data-theme=dark] div.css-1b0ypf8 > div.css-1sqjzsk > div.css-tr5tvs > img').after('<div class=\"css-zprod6\"></div>');
    }
}
 
//GIF自动播放
function gifPlaying () {
    if (GIFAutoPlay == 1) {
        $(".GifPlayer .ztext-gif").each(function () {
            if($(this).hasClass('GifPlayer-gif2mp4'))
            {
                if($(this).get(0).paused)
                {
                    $(this).get(0).play();
                    $(this).addClass('play');
                }
            }
            else
            {
                $(this).parent().addClass("isPlaying");
                if ($(this).attr("src").indexOf("webp") == -1) {
                    $(this).attr("src", $(this).attr("src").replace("jpg", "webp"));
                    //$(this).wrap("<a target=\'_blank\' href=\'" + $(this).attr("src") + "\'></a>");
                }
            }
        });
 
    }
 
}
 
function printValue()
{
    console.log('\n');
    console.log('hideIndexSidebar='+hideIndexSidebar);
    console.log('hideQuestionSidebar='+hideQuestionSidebar);
    console.log('hideSearchSideBar='+hideSearchSideBar);
    console.log('hideTopicSideBar='+hideTopicSideBar);
    console.log('hideCollectionSideBar='+hideCollectionSideBar);
    console.log('hideClubSideBar='+ hideClubSideBar);
    console.log('hideDraftSideBar='+ hideDraftSideBar);
    console.log('hideLaterSideBar='+ hideLaterSideBar);
    console.log('hideProfileSidebar='+ hideProfileSidebar);
    console.log('hideRecommendedReading='+ hideRecommendedReading);
    console.log('publishTop='+  publishTop);
    console.log('GIFAutoPlay='+ GIFAutoPlay);
    console.log('hoverShadow='+  hoverShadow);
    console.log('blockingPictureVideo='+  blockingPictureVideo);
    console.log('\n');
}
 
//设置框样式参考https://greasyfork.org/zh-CN/scripts/37988
 
function settings()
{
    $('body').append('<div id="settingLayerMask" style="display: flex;">'+
                     '	<div id="settingLayer">'+
                     '		<div id="itemlist">'+
                     '			<section class="switch"><span>隐藏首页侧边栏</span>'+
                     '				<select name="hideIndexSidebar" id="hideIndexSidebar">'+
                     '						<option value="0">不隐藏</option>'+
                     '						<option value="1" selected="selected">隐藏，拉宽显示内容</option>'+
                     '						<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏回答侧边栏</span>'+
                     '				<select name="hideQuestionSidebar" id="hideQuestionSidebar">'+
                     '							<option value="0">不隐藏</option>'+
                     '							<option value="1" selected="selected">隐藏，拉宽显示内容</option>'+
                     '							<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏搜索侧边栏</span>'+
                     '				<select name="hideSearchSideBar" id="hideSearchSideBar">'+
                     '						<<option value="0">不隐藏</option>'+
                     '						<option value="1" selected="selected">隐藏，拉宽显示内容</option>'+
                     '						<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏话题侧边栏</span>'+
                     '				<select name="hideTopicSideBar" id="hideTopicSideBar">'+
                     '							<option value="0">不隐藏</option>'+
                     '							<option value="1" selected="selected">隐藏，拉宽显示内容</option>'+
                     '							<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏收藏侧边栏</span>'+
                     '				<select name="hideCollectionSideBar" id="hideCollectionSideBar">'+
                     '							<option value="0">不隐藏</option>'+
                     '							<option value="1" selected="selected">隐藏，拉宽显示内容</option>'+
                     '							<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏圈子侧边栏</span>'+
                     '				<select name="hideClubSideBar" id="hideClubSideBar">'+
                     '							<option value="0">不隐藏</option>'+
                     '							<option value="1" selected="selected">隐藏，拉宽显示内容</option>'+
                     '							<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏草稿侧边栏</span>'+
                     '				<select name="hideDraftSideBar" id="hideDraftSideBar">'+
                     '							<option value="0">不隐藏</option>'+
                     '							<option value="1" selected="selected">隐藏，拉宽显示内容</option>'+
                     '							<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏稍后答侧边栏</span>'+
                     '				<select name="hideLaterSideBar" id="hideLaterSideBar">'+
                     '							<option value="0">不隐藏</option>'+
                     '							<option value="1" selected="selected">隐藏，拉宽显示内容</option>'+
                     '							<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏用户主页侧边栏</span>'+
                     '				<select name="hideProfileSidebar" id="hideProfileSidebar">'+
                     '							<option value="0" selected="selected">不隐藏</option>'+
                     '							<option value="1">隐藏，拉宽显示内容</option>'+
                     '							<option value="2">隐藏，居中显示内容</option>'+
                     '				</select>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏专栏推荐</span>'+
                     '				<div class="checkbox on"><input type="checkbox" name="hideRecommendedReading" id="hideRecommendedReading" value="1"><label class="switchLabel"></label></div>'+
                     '			</section>'+
                     '			<section class="switch"><span>置顶回答时间</span>'+
                     '				<div class="checkbox on"><input type="checkbox" name="publishTop" id="publishTop" value="1"><label class="switchLabel"></label></div>'+
                     '			</section>'+
                     '			<section class="switch"><span>GIF自动播放</span>'+
                     '				<div class="checkbox"><input type="checkbox" name="GIFAutoPlay" id="GIFAutoPlay" value="0"><label class="switchLabel"></label></div>'+
                     '			</section>'+
                     '			<section class="switch"><span>悬停时显示浅蓝色边框</span>'+
                     '				<div class="checkbox on"><input type="checkbox" name="hoverShadow" id="hoverShadow" value="1"><label class="switchLabel"></label></div>'+
                     '			</section>'+
                     '			<section class="switch"><span>隐藏图片/视频</span>'+
                     '				<div class="checkbox on"><input type="checkbox" name="blockingPictureVideo" id="blockingPictureVideo" value="0"><label class="switchLabel"></label></div>'+
                     '			</section>'+
                     '			<section class="switch" style="visibility:hidden"><span>none1</span>'+
                     '				<div class="checkbox on"><input type="checkbox" name="none1" id="none1" value="1"><label class="switchLabel"></label></div>'+
                     '			</section>'+
                     '		</div>'+
                     '		<div id="btnEle">'+
                     '			<div class="btnEleLayer">'+
                     '				<span id="settings-save" title="save &amp; fresh">保存并刷新</span>'+
                     '			</div>'+
                     '		</div><span id="settings-close" title="close 关闭"></span></div>'+
                     '</div>');
 
    GM_addStyle('#settingLayer #itemlist {'+
                '    display: flex;'+
                '    display: -webkit-flex;'+
                '    align-content: center;'+
                '    align-items: center;'+
                '    justify-content: center;'+
                '    flex-flow: row wrap;'+
                '}'+
                ''+
                '#settingLayer section {'+
                '    display: grid;'+
                '    float: left;'+
                '    width: 200px;'+
                '    padding: 10px 20px;'+
                '    border-right: 1px solid #0084ff;'+
                '}'+
                ''+
                '#settingLayer section:nth-of-type(3n) {'+
                '    border-right: none;'+
                '}'+
                ''+
                '#settingLayer .switch span {'+
                '    height: 30px;'+
                '    line-height: 30px;'+
                '    font-size: 20px;'+
                '    vertical-align: top;'+
                '}'+
                ''+
                '#settingLayer .switch .checkbox {'+
                '    float: right;'+
                '}'+
                ''+
                '#settingLayer .checkbox {'+
                '    position: relative;'+
                '    display: inline-block;'+
                '}'+
                ''+
                '#settingLayer .checkbox:after,'+
                '#settingLayer .checkbox:before {'+
                '    -webkit-font-feature-settings: normal;'+
                '    -moz-font-feature-settings: normal;'+
                '    font-feature-settings: normal;'+
                '    -webkit-font-kerning: auto;'+
                '    font-kerning: auto;'+
                '    -moz-font-language-override: normal;'+
                '    font-language-override: normal;'+
                '    font-stretch: normal;'+
                '    font-style: normal;'+
                '    font-synthesis: weight style;'+
                '    font-variant: normal;'+
                '    font-weight: normal;'+
                '    text-rendering: auto;'+
                '}'+
                ''+
                '#settingLayer .checkbox label {'+
                '    width: 80px;'+
                '    height: 30px;'+
                '    background: #ccc;'+
                '    position: relative;'+
                '    display: inline-block;'+
                '    border-radius: 46px;'+
                '    -webkit-transition: 0.4s;'+
                '    transition: 0.4s;'+
                '    cursor: pointer;'+
                '}'+
                ''+
                '#settingLayer .checkbox label:after {'+
                '    content: "";'+
                '    position: absolute;'+
                '    width: 50px;'+
                '    height: 50px;'+
                '    border-radius: 100%;'+
                '    left: 0;'+
                '    top: -5px;'+
                '    z-index: 2;'+
                '    background: #fff;'+
                '    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);'+
                '    -webkit-transition: 0.4s;'+
                '    transition: 0.4s;'+
                '    cursor: pointer;'+
                '}'+
                ''+
                '#settingLayer .checkbox input {'+
                '    display: none;'+
                '}'+
                ''+
                '#settingLayer .checkbox.on label:after {'+
                '    left: 40px;'+
                '}'+
                ''+
                '#settingLayer .checkbox.on label {'+
                '    background: #4BD865;'+
                '}'+
                ''+
                '#settingLayer .switch .checkbox label {'+
                '    width: 70px;'+
                '}'+
                ''+
                '#settingLayer .switch .checkbox label:after {'+
                '    top: 0;'+
                '    width: 30px;'+
                '    height: 30px;'+
                '}'+
                ''+
                ''+
                '/* 弹出层 */'+
                ''+
                '#settingLayerMask {'+
                '    display: none;'+
                '    justify-content: center;'+
                '    align-items: center;'+
                '    position: fixed;'+
                '    top: 0;'+
                '    right: 0;'+
                '    bottom: 0;'+
                '    left: 0;'+
                '    background-color: rgba(0, 0, 0, .5);'+
                '    z-index: 200000000;'+
                '    overflow: auto;'+
                '    font-family: arial, sans-serif;'+
                '    min-height: 100%;'+
                '    font-size: 16px;'+
                '    transition: 0.5s;'+
                '    opacity: 1;'+
                '    user-select: none;'+
                '    -moz-user-select: none;'+
                '    padding-bottom: 80px;'+
                '    box-sizing: border-box;'+
                '}'+
                ''+
                '#settingLayer {'+
                '    display: flex;'+
                '    flex-wrap: wrap;'+
                '    padding: 20px;'+
                '    margin: 0px 25px 50px 5px;'+
                '    background-color: #fff;'+
                '    border-radius: 4px;'+
                '    position: absolute;'+
                '    width: 60%;'+
                '    transition: 0.5s;'+
                '}'+
                ''+
                '#settingLayer #btnEle {'+
                '    position: absolute;'+
                '    width: 100%;'+
                '    bottom: 4px;'+
                '    right: 0;'+
                '    background: #fff;'+
                '    border-radius: 4px;'+
                '}'+
                ''+
                '#settingLayer #btnEle span {'+
                '    display: inline-block;'+
                '    background: #EFF4F8;'+
                '    border: 1px solid #3abdc1;'+
                '    margin: 12px auto 10px;'+
                '    color: #3abdc1;'+
                '    padding: 5px 10px;'+
                '    border-radius: 4px;'+
                '    cursor: pointer;'+
                '    outline: none;'+
                '    transition: 0.3s;'+
                '}'+
                ''+
                '#settingLayer #btnEle a {'+
                '    color: #999;'+
                '    text-decoration: none;'+
                '}'+
                ''+
                '#settingLayer #btnEle a:hover {'+
                '    text-decoration: underline;'+
                '    color: #ef8957;'+
                '}'+
                ''+
                '#settingLayer #btnEle span.feedback:hover {'+
                '    border-color: #ef8957;'+
                '}'+
                ''+
                '#settingLayer #btnEle span:not(.feedback):hover {'+
                '    background: #3ACBDD;'+
                '    color: #fff;'+
                '}'+
                ''+
                '#settingLayer #btnEle .feedback {'+
                '    border-color: #aaa;'+
                '}'+
                ''+
                '#settingLayer #btnEle>div {'+
                '    width: 100%;'+
                '    margin-bottom: -100%;'+
                '    display: flex;'+
                '    justify-content: space-around;'+
                '    background: #EFF4F8;'+
                '    border-radius: 4px;'+
                '}'+
                ''+
                ''+
                '/*close button*/'+
                ''+
                '#settingLayer #settings-close {'+
                '    background: white;'+
                '    color: #3ABDC1;'+
                '    line-height: 20px;'+
                '    text-align: center;'+
                '    height: 20px;'+
                '    width: 20px;'+
                '    font-size: 20px;'+
                '    padding: 10px;'+
                '    border: 3px solid #3ABDC1;'+
                '    border-radius: 50%;'+
                '    transition: .5s;'+
                '    top: -20px;'+
                '    right: -20px;'+
                '    position: absolute;'+
                '    cursor: pointer;'+
                '}'+
                ''+
                '#settingLayer #settings-close::before {'+
                '    content: "\\2716";'+
                '}'+
                ''+
                '#settingLayer #settings-close:hover {'+
                '    background: indianred;'+
                '    border-color: indianred;'+
                '    color: #fff;'+
                '}'+
                ''+
                '#settingLayer select {'+
                '    height: 30px;'+
                '    width: 180px;'+
                '    color: #0084FF;'+
                '    font-size: 16px;'+
                '    position: relative;'+
                '    display: inline-block;'+
                '    border-radius: 46px;'+
                '    -webkit-transition: 0.4s;'+
                '    transition: 0.4s;'+
                '    cursor: pointer;'+
                '}'+
                'html[data-theme=dark] #settingLayer{'+
                '    background: #191c25;'+
                '}'+
                'html[data-theme=dark] #settingLayer #btnEle>div{'+
                '    background: #25282f;'+
                '}'+
                'html[data-theme=dark] #settingLayer #settings-save, html[data-theme=dark] #settingLayer select, html[data-theme=dark] #settingLayer option{'+
                '    background: #8080801c;'+
                '}'+
                'html[data-theme=dark] #settingLayer #settings-close{'+
                '    background: #25282f;'+
                '}'
               );
 
    //默认隐藏
    $('#settingLayerMask').hide();
 
    //读取值
    hideIndexSidebar = GM_getValue('hideIndexSidebar');
    hideQuestionSidebar = GM_getValue('hideQuestionSidebar');
    hideSearchSideBar = GM_getValue('hideSearchSideBar');
    hideTopicSideBar = GM_getValue('hideTopicSideBar');
    hideCollectionSideBar = GM_getValue('hideCollectionSideBar');
    hideClubSideBar = GM_getValue('hideClubSideBar');
    hideDraftSideBar = GM_getValue('hideDraftSideBar');
    hideLaterSideBar = GM_getValue('hideLaterSideBar');
    hideProfileSidebar = GM_getValue('hideProfileSidebar');
    hideRecommendedReading = GM_getValue('hideRecommendedReading');
    publishTop = GM_getValue('publishTop');
    GIFAutoPlay = GM_getValue('GIFAutoPlay');
    hoverShadow = GM_getValue('hoverShadow');
    blockingPictureVideo = GM_getValue('blockingPictureVideo');
 
 
    printValue();//输出所有设置值
 
    //在设置界面设置相应值
    $('select option').removeAttr('selected');
 
    $('#hideIndexSidebar').val(hideIndexSidebar);
    $('#hideQuestionSidebar').val(hideQuestionSidebar);
    $('#hideSearchSideBar').val(hideSearchSideBar);
    $('#hideTopicSideBar').val(hideTopicSideBar);
    $('#hideCollectionSideBar').val(hideCollectionSideBar);
    $('#hideClubSideBar').val(hideClubSideBar);
    $('#hideDraftSideBar').val(hideDraftSideBar);
    $('#hideLaterSideBar').val(hideLaterSideBar);
    $('#hideProfileSidebar').val(hideProfileSidebar);
    $('#hideRecommendedReading').val(hideRecommendedReading);
    $('#publishTop').val(publishTop);
    $('#GIFAutoPlay').val(GIFAutoPlay);
    $('#hoverShadow').val(hoverShadow);
    $('#blockingPictureVideo').val(blockingPictureVideo);
 
 
    $('.checkbox').each(function(){
        if($(this).find('input').val()==1)
            $(this).addClass('on');
        else
            $(this).removeClass('on');
    });
 
 
 
 
    //点击关闭按钮隐藏
    $('#settings-close').click(function(){
        $('#settingLayerMask').hide();
    });
 
    //按ESC键隐藏
    $(document).keyup(function (e) {
        if (e.key === "Escape") {
            $('#settingLayerMask').hide();
        }
    });
 
    //开关按钮
    $('.checkbox').click(function(){
        if($(this).hasClass('on'))
        {
            $(this).find('input').val('0');
        }
        else
        {
            $(this).find('input').val('1');
        }
        $(this).toggleClass('on');
    })
 
    //保存设置
    $('#settings-save').click(function(){
        hideIndexSidebar = $('#hideIndexSidebar').val();
        hideQuestionSidebar = $('#hideQuestionSidebar').val();
        hideSearchSideBar = $('#hideSearchSideBar').val();
        hideTopicSideBar = $('#hideTopicSideBar').val();
        hideCollectionSideBar = $('#hideCollectionSideBar').val();
        hideClubSideBar = $('#hideClubSideBar').val();
        hideDraftSideBar = $('#hideDraftSideBar').val();
        hideLaterSideBar = $('#hideLaterSideBar').val();
        hideProfileSidebar = $('#hideProfileSidebar').val();
        hideRecommendedReading = $('#hideRecommendedReading').val();
        publishTop = $('#publishTop').val();
        GIFAutoPlay = $('#GIFAutoPlay').val();
        hoverShadow = $('#hoverShadow').val();
        blockingPictureVideo = $('#blockingPictureVideo').val();
 
 
        GM_setValue('hideIndexSidebar',hideIndexSidebar);
        GM_setValue('hideQuestionSidebar',hideQuestionSidebar);
        GM_setValue('hideSearchSideBar',hideSearchSideBar);
        GM_setValue('hideTopicSideBar',hideTopicSideBar);
        GM_setValue('hideCollectionSideBar',hideCollectionSideBar);
        GM_setValue('hideClubSideBar',hideClubSideBar);
        GM_setValue('hideDraftSideBar',hideDraftSideBar);
        GM_setValue('hideLaterSideBar',hideLaterSideBar);
        GM_setValue('hideProfileSidebar',hideProfileSidebar);
        GM_setValue('hideRecommendedReading',hideRecommendedReading);
        GM_setValue('publishTop',publishTop);
        GM_setValue('GIFAutoPlay',GIFAutoPlay);
        GM_setValue('hoverShadow',hoverShadow);
        GM_setValue('blockingPictureVideo',blockingPictureVideo);
 
 
        $('#settingLayerMask').hide(); //隐藏设置
        window.location.reload();//刷新当前页面.
    });
 
}
 
 
function clearValue()
{
    GM_deleteValue('hideIndexSidebar');
    GM_deleteValue('hideQuestionSidebar');
    GM_deleteValue('hideSearchSideBar');
    GM_deleteValue('hideTopicSideBar');
    GM_deleteValue('hideCollectionSideBar');
    GM_deleteValue('hideClubSideBar');
    GM_deleteValue('hideDraftSideBar');
    GM_deleteValue('hideLaterSideBar');
    GM_deleteValue('hideProfileSidebar');
    GM_deleteValue('hideRecommendedReading');
    GM_deleteValue('publishTop');
    GM_deleteValue('GIFAutoPlay');
    GM_deleteValue('hoverShadow');
    GM_deleteValue('blockingPictureVideo');
 
}
 
 
(function () {
    'use strict';
 
    //根据当前cookie，判断是否设置夜间模式
    if ($.cookie('nightmode') != undefined) {
        if ($.cookie('nightmode') == 1) {
            $("html").attr("data-theme", "dark");
            $("#nightmode").find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
            $("#nightmode").find("span").text(" 日间模式");
        }
        else {
            $("html").attr("data-theme", "light");
            $("#nightmode").find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
            $("#nightmode").find("span").text(" 夜间模式");
        }
    }
 
    $('head').append(`<meta http-equiv="Content-Security-Policy" content="script-src * 'unsafe-eval'">`);
 
    //clearValue(); //清空所有设置值
 
    //设置默认值
    if(GM_getValue('hideIndexSidebar')==undefined)
    {
        GM_setValue('hideIndexSidebar','1');
    }
 
    if(GM_getValue('hideQuestionSidebar')==undefined)
    {
        GM_setValue('hideQuestionSidebar','1');
    }
 
    if(GM_getValue('hideSearchSideBar')==undefined)
    {
        GM_setValue('hideSearchSideBar','1');
    }
 
    if(GM_getValue('hideTopicSideBar')==undefined)
    {
        GM_setValue('hideTopicSideBar','1');
    }
 
    if(GM_getValue('hideCollectionSideBar')==undefined)
    {
        GM_setValue('hideCollectionSideBar','1');
    }
 
    if(GM_getValue('hideClubSideBar')==undefined)
    {
        GM_setValue('hideClubSideBar','1');
    }
 
    if(GM_getValue('hideDraftSideBar')==undefined)
    {
        GM_setValue('hideDraftSideBar','1');
    }
 
    if(GM_getValue('hideLaterSideBar')==undefined)
    {
        GM_setValue('hideLaterSideBar','1');
    }
 
    if(GM_getValue('hideProfileSidebar')==undefined)
    {
        GM_setValue('hideProfileSidebar','0');
    }
 
    if(GM_getValue('hideRecommendedReading')==undefined)
    {
        GM_setValue('hideRecommendedReading','1');
    }
 
    if(GM_getValue('publishTop')==undefined)
    {
        GM_setValue('publishTop','1');
    }
 
    if(GM_getValue('GIFAutoPlay')==undefined)
    {
        GM_setValue('GIFAutoPlay','0');
    }
 
    if(GM_getValue('hoverShadow')==undefined)
    {
        GM_setValue('hoverShadow','1');
    }
 
    if(GM_getValue('blockingPictureVideo')==undefined)
    {
        GM_setValue('blockingPictureVideo','0');
    }
 
 
 
 
    //设置界面
    settings();
 
    //注册设置按钮
    GM_registerMenuCommand("知乎 美化 设置", function(){ $('#settingLayerMask').show(); });
 
    //添加自定义CSS
    addCSS();
 
    //全局功能函数
    setInterval(directLink, 100);
    setInterval(iconColor, 100);
    setInterval(originalPic, 100);
    setInterval(downloadVideo, 100);
    setInterval(gifPlaying, 100);
 
    //清空搜索框占位符
    setInterval(function () {
        $(".SearchBar-input input").attr("placeholder", "");
    }, 100);
 
    //折叠谢邀
    let timer = setInterval(function () {
        if ($(".QuestionInvitation-content").text().indexOf("更多推荐结果") > -1) {
            clearInterval(timer);
            $(".QuestionInvitation-content").addClass("hide");
            $(".QuestionInvitation-content").hide();
 
            $(".QuestionInvitation-title").html($(".QuestionInvitation-title").text() + '<span style=\"color:#8590A6;\">(点击此处展开/折叠)</span>');
 
            $(".Topbar").click(function () {
 
                if (($(".QuestionInvitation-content").hasClass("hide"))) {
                    $(".QuestionInvitation-content").removeClass("hide").addClass("show");
                    $(".QuestionInvitation-content").show();
                }
                else {
                    $(".QuestionInvitation-content").removeClass("show").addClass("hide");
                    $(".QuestionInvitation-content").hide();
                }
            });
        }
    }, 100);
 
    //每个页面对应的功能函数
    if (window.location.href.indexOf("question") > -1) //回答页
        setInterval(question, 300);
    else if (window.location.href.indexOf("zvideo") > -1) //知乎视频页
        setInterval(zvideo, 300);
    else if (window.location.href.indexOf("club") > -1) //知乎圈子页
        setInterval(club, 300);
    else if (window.location.href.indexOf("search") > -1) //搜索结果页
        setInterval(search, 300);
    else if (window.location.href.indexOf("lives") > -1) //知乎讲座页
        setInterval(lives, 300);
    else if (window.location.href.indexOf("collection") > -1) //收藏夹
        setInterval(collection, 300);
    else if (window.location.href.indexOf("zhuanlan") > -1) //专栏
        setInterval(zhuanlan, 300);
    else if (window.location.href.indexOf("people") > -1 || window.location.href.indexOf("org") > -1) //用户主页
        setInterval(people, 300);
    else if (window.location.href.indexOf("topic") > -1) //话题页
        setInterval(topic, 300);
    else if (window.location.href.indexOf("draft") > -1) //草稿页
        setInterval(draft, 300);
    else if (window.location.href.indexOf("roundtable") > -1) //知乎圆桌页
        setInterval(roundtable, 300);
    else
        setInterval(index, 300); //首页
 
})();
