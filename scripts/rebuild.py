"""Rebuild existing HTML pages and homepage catalog from editable Markdown."""
import csv
import html
import json
from pathlib import Path
import markdown
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / 'articles.json').read_text(encoding='utf-8'))
for item in catalog['articles']:
    path = ROOT / item['url']
    source = (ROOT / item['contentFile']).read_text(encoding='utf-8')
    if '<!-- ARTICLE CONTENT -->' not in source:
        raise ValueError(f'Missing article content marker: {item["contentFile"]}')
    source = source.split('<!-- ARTICLE CONTENT -->', 1)[1]
    rendered = markdown.markdown(source, extensions=['tables','fenced_code','sane_lists'])
    rendered = rendered.replace('src="../assets/', 'src="../../assets/').replace('href="../assets/', 'href="../../assets/').replace('href="../articles/', 'href="../../articles/').replace('href="../index.html', 'href="../../index.html')
    document = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    document.select_one('.article-body').clear()
    document.select_one('.article-body').append(BeautifulSoup(rendered,'html.parser'))
    headings = document.select('.article-body h2,.article-body h3,.article-body h4')
    for i, heading in enumerate(headings, 1):
        heading['id'] = f'section-{i}'
    toc = document.select_one('.reading-toc')
    if toc:
        toc.decompose()
    if headings:
        nav = document.new_tag('nav', attrs={'class':'reading-toc','aria-label':'文章目錄'})
        details = document.new_tag('details', open='')
        summary = document.new_tag('summary')
        summary.string = '文章目錄'
        details.append(summary)
        entries = document.new_tag('ol')
        for heading in headings:
            li = document.new_tag('li')
            anchor = document.new_tag('a',href='#'+heading['id'])
            anchor.string = heading.get_text(' ',strip=True)
            li.append(anchor)
            entries.append(li)
        details.append(entries)
        nav.append(details)
        document.select_one('.reading-layout').insert(0,nav)
    document.h1.string = item['title']
    document.title.string = item['title'] + '｜臺灣復元優勢觀點社會工作學會'
    document.select_one('.reading-header .eyebrow').string = item['category'] + ' · ' + item['format']
    document.select_one('.reading-deck').string = item['summary']
    document.select_one('meta[name="description"]')['content'] = item['summary']
    document.select_one('time')['datetime'] = item['date']
    document.select_one('time').string = item['date']
    related = document.select_one('.related-articles ul')
    related.clear()
    peers = [a for a in catalog['articles'] if a['category']==item['category'] and a['id']!=item['id']][:3]
    for peer in peers:
        li = document.new_tag('li')
        anchor = document.new_tag('a', href=f'../{peer["id"]}/index.html')
        anchor.string = peer['title']
        li.append(anchor)
        related.append(li)
    path.write_text(str(document),encoding='utf-8')

home_path = ROOT/'index.html'
home = BeautifulSoup(home_path.read_text(encoding='utf-8'),'html.parser')
home.select_one('#catalog-data').string = json.dumps(catalog,ensure_ascii=False).replace('<','\\u003c')
grid = home.select_one('#article-grid')
grid.clear()
featured = home.select_one('#featured-grid')
featured.clear()
for a in catalog['articles']:
    title, summary, category = map(html.escape,(a['title'],a['summary'],a['category']))
    card = f'<article class="article-card"><div class="card-topline"><span class="category-badge">{category}</span><time datetime="{a["date"]}">{a["date"]}</time></div><h3>{title}</h3><p class="card-summary">{summary}</p><div class="tag-list">'+''.join('<span>'+html.escape(t)+'</span>' for t in a['tags'])+f'</div><div class="card-footer"><span class="format-label">{html.escape(a["format"])}</span><a href="{a["url"]}">閱讀全文</a></div></article>'
    grid.append(BeautifulSoup(card,'html.parser'))
    if a.get('pinned'):
        featured.append(BeautifulSoup(f'<article class="featured-card"><div class="featured-meta"><span>{category}</span><time datetime="{a["date"]}">{a["date"]}</time></div><h3>{title}</h3><p>{summary}</p><a href="{a["url"]}">閱讀全文</a></article>','html.parser'))
home.select_one('#article-total').string = str(len(catalog['articles']))
home.select_one('#category-total').string = str(len(set(a['category'] for a in catalog['articles'])))
home.select_one('#result-count').string = f'共 {len(catalog["articles"])} 篇文章'
home_path.write_text(str(home),encoding='utf-8')
with (ROOT/'articles.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    keys = ['id','title','sourceTitle','date','category','format','summary','url','sourceUrl','contentFile','status','tags']
    writer = csv.DictWriter(handle,fieldnames=keys,extrasaction='ignore')
    writer.writeheader()
    for a in catalog['articles']:
        writer.writerow({**a,'tags':'|'.join(a['tags'])})
print(f'Rebuilt {len(catalog["articles"])} articles and homepage catalog.')
