---
title: Interview
index: false
icon: tabler:file-pencil
---

<!-- ### GitHub Issues -->

<RedDiv>
    <div v-for="issue in issues" :key="issue.id">
        <h3 :id="issue.title" tabindex="-1">
            <a class="header-anchor" :href="`#${issue.title}`" aria-hidden="true">#</a> {{ issue.title }}
        </h3>
        <pre style="max-width: 100%; overflow: hidden; text-wrap: wrap; background: #eee;">{{ issue.body }}</pre>
    </div> 
</RedDiv>

<script setup>
    import { h, ref, onMounted } from 'vue';
    const RedDiv = (_, ctx) =>
    h('div',{ class:'issues' },ctx.slots.default())

    const issues = ref([])

    const getIssues = async () => {
        try {
            // https://api.github.com/repos/{owner}/{repository}/issues?milestone=&state=&assignee=&creator=&mentioned=&labels=&sort=&direction=&since=&per_page=&page=
            const response = await fetch('https://api.github.com/repos/kangduu/camps/issues?state=open&sort=updated');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            issues.value = data;
        } catch (error) {
            console.error('Error fetching issues:', error);
        }
    };

    onMounted(() => {
        getIssues();
    });
</script>

### 分类整理

- [编程题](./%E7%BC%96%E7%A8%8B%E9%A2%98.md)
- [数据结构与算法](./Algorithm.md)
- [浏览器相关](./Browser.md)
- [DOM 操作](./Dom.md)
- [HTML-CSS](./HTML-CSS.md)
- [JavaScript 基础](./Javascript.md)
- [Webpack](./webpack.md)
- [Vue.js](./Vue.md)
- [JQuery](./jQuery.md)
