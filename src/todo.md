---
title: 待办事项
---

<RedDiv>
    <ul>
        <li v-for="issue in issues" :key="issue.id">
            <a :href="issue.html_url" target="_blank">{{ issue.title }}</a>
            <!-- <pre style="white-space; pre-wrap">{{ issue.body }}</pre> -->
        </li>
    </ul>

</RedDiv>

<script setup>
    import { h, ref, onMounted } from 'vue'

    const RedDiv = (_, ctx) =>
    h('div',{ class:'issues' },ctx.slots.default())

    const issues = ref([])

    const getIssues = async () => {
        try {
            const response = await fetch('https://api.github.com/repos/kangduu/camp/issues?labels=todoist&state=open&sort=updated');
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
