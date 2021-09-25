import * as $ from 'jquery';

import style from './style.css';

GM_addStyle(style);

const castKeyword = '首播';
const configKey = 'index-sort-order';
type Mode = 'normal' | 'smart' | 'update';

function bangumiSortIndex(): void {
  class Subject {
    el: JQuery<Element>;
    nextDate: number;
    lastWatched: number;
    title: string;
    airing: number;
    smartKey: number;

    constructor(el: JQuery<Element>) {
      this.el = el;

      const titleEL = el.find('.epGird .tinyHeader .textTip').last();
      this.title =
        titleEL.attr('data-subject-name-cn') ??
        titleEL.attr('data-original-title') ??
        titleEL.attr('data-subject-name') ??
        'title';

      const nextWatch = el.find('li a:not(.epBtnWatched)').first();
      const rel = nextWatch.attr('rel');
      if (rel) {
        this.nextDate = getDate(rel);
      } else {
        this.nextDate = 0;
      }

      const lastWatched = el.find('li a:not(.epBtnWatched)').last();
      const lastWatchedRel = lastWatched.attr('rel');
      if (lastWatchedRel) {
        this.lastWatched = getDate(lastWatchedRel);
      } else {
        this.lastWatched = 0;
      }

      this.airing = el.find('li a.epBtnNA').length !== 0 ? -1 : 1;
      this.smartKey = this.airing;
    }
  }

  const container = $('#cloumnSubjectInfo .infoWrapper_tv');

  const originals: Subject[] = Array.from(
    $('.infoWrapper_tv [id^=subjectPanel_]')
  ).map((element) => {
    return new Subject($(element));
  });

  const subjects: Subject[] = [...originals];

  function getDate(rel: string): number {
    const castDate = Array.from(
      document.querySelector(rel)?.querySelector('span.tip')?.childNodes ??
        ([] as Element[])
    )
      .filter((e) => e.nodeType === Node.TEXT_NODE)
      .map((e) => e.textContent ?? '')
      .filter((t) => t.includes(castKeyword));

    if (castDate.length) {
      return new Date(castDate[0].replace(`${castKeyword}:`, '')).getTime();
    }
    return 0;
  }

  function render(subjects: Subject[]): void {
    subjects.forEach((s) => {
      s.el.remove();
    });
    subjects.forEach((s, i) => {
      s.el.removeClass('odd');
      s.el.removeClass('even');
      if (i % 2) {
        s.el.addClass('even');
      } else {
        s.el.addClass('odd');
      }
      container.append(s.el);
    });
  }

  function smart(subjects: Subject[]): void {
    subjects.sort((a, b) => {
      if (a.airing === b.airing) {
        return (b.nextDate - a.nextDate) * a.airing;
      }
      return a.airing;
    });

    render(subjects);
  }

  function update(subjects: Subject[]): void {
    subjects.sort((a, b) => -a.lastWatched + b.lastWatched);
    render(subjects);
  }

  function normal(): void {
    render(originals);
  }

  function onLoad(): void {
    // prgManagerMain.classList.contains('tinyModeWrapper')

    const orderUI = $(`<ul id='prgManagerOrder' class='categoryTab clearit rr'>

<li data-mode='normal'><a href='javascript:void(0);' id='switchNormalOrder' title='修改順序'><span>標準</span></a></li>
<li data-mode='smart' ><a href='javascript:void(0);' id='switchSmartOrder'  title='智障順序'><span>智能</span></a></li>
<li data-mode='update'><a href='javascript:void(0);' id='switchUpdateOrder' title='更新順序'><span>更新</span></a></li>

</ul>`);

    $('#prgManagerHeader').append(orderUI[0]);

    if (!localStorage['index-sort-order']) {
      localStorage['index-sort-order'] = 'smart';
    }

    const optionUIs = orderUI.find('li');

    let mode: Mode =
      (localStorage.getItem(configKey) as Mode | undefined) ?? 'normal';

    function click(): void {
      optionUIs.find('a').removeClass('focus');

      if (this) {
        const el = $(this);
        mode = el.data('mode')?.toString();
        localStorage.setItem(configKey, mode);
      }

      switch (mode) {
        case 'smart':
          smart(subjects);
          break;
        case 'update':
          update(subjects);
          break;
        case 'normal':
          normal();
          break;
        default:
          mode = 'normal';
          localStorage.setItem(configKey, mode);
          normal();
      }

      $(`#prgManagerOrder li[data-mode="${mode}"]`).find('a').addClass('focus');
    }

    optionUIs.on('click', click);
    click();
  }

  onLoad();
}

bangumiSortIndex();
