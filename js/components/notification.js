Vue.component("notification", {
    props: ["notification"],
    computed: {
        notificationClass: function() {
            let classNames = ["", "error", "success", "special"];
            let res = {};
            res[classNames[this.notification.type]] = true;
            return res;
        }
    },
    template: `<transition name="expandable">
    <div class="notification" :class="notificationClass">
        <img v-if="notification.icon" class="inline" :src="notification.icon"/>
        <span>{{notification.message}}</span>
    </div>
</transition>`
});