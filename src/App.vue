<template lang="jade">
#app.app
  Navbar(:routes = "myRoutes", :routesMobile = 'routesMobile', :allTopics = "allTopics")

  #main.main
    //- transition(name='fade', mode='out-in')
    router-view(:allTopics="allTopics", :catagories="catagories", :allNews="allNews", :allInfo="allInfo")

  footNav
</template>

<script>

import Navbar from './components/app_navbar.vue'
import footNav from './components/app_footer.vue'
import caxios from './js/request'

export default {
  components: {
    Navbar,
    footNav
  },
  data () {
    return {
      myRoutes: [
        {en:'Home',t:'首頁',r:''},
        {en:'User manual',t:'使用手冊',r:'how-to-use'},
        {en:'About',t:'關於 vTaiwan',r:'intro'},
        // {en:'Login', t:'登入',r:'login'},
      ],
      routesMobile: [
        {en:'User manual',t:'使用手冊',r:'how-to-use'},
        {en:'Home',t:'探索議題',r:''},
        {en:'Search',t:'搜尋議題',r:'search'},
      ],
      catagories: [],
      allTopics: [],
      allNews: [],
      allInfo: []
    }
  },
  methods: {
    pure(path) {
      var obj = this.myRoutes.filter((o) => {
        return '/'+o.r == path;
      })[0]
      return obj ? obj.r : ''
    },
    getProgress(raw) {
      // var regex = /(?: (?:init )?)|\n/g;
      // var start = new Date(raw.split(regex)[1]+"T00:00:00+08:00");
      // var end = new Date(raw.split(regex)[2]+"T00:00:00+08:00");
      let re = /[0-9]+-[0-9]+-[0-9]+(\s[0-9]+:[0-9]+:[0-9]*)?/g
      let start = new Date(raw.match(re)[0])
      let end = new Date(raw.match(re)[1] || raw.match(re)[0])
      var now = new Date();
      if (now > end) {
        return (end - start)/(24*60*60*1000); /* Math.floor? */
      }
      else{
        return (now - start)/(24*60*60*1000);
      }
    },
    getTotal(raw) {
      // var regex = /(?: (?:init )?)|\n/g;
      // var start = new Date(raw.split(regex)[1]+"T00:00:00+08:00");
      // var end = new Date(raw.split(regex)[2]+"T00:00:00+08:00");
      let re = /[0-9]+-[0-9]+-[0-9]+(\s[0-9]+:[0-9]+:[0-9]*)?/g
      let start = new Date(raw.match(re)[0])
      let end = new Date(raw.match(re)[1] || raw.match(re)[0])
      return (end - start)/(24*60*60*1000)
    }
  },
  mounted: function(){

    caxios.get('https://talk.vtaiwan.tw/c/meta-data.json')
    .then((response)=>{
      var topics = response.data.topic_list.topics.slice(1);
      // console.log(response.data.topic_list.topics[0].title + ' removed')
      topics.forEach((topic)=>{
        caxios.get('https://talk.vtaiwan.tw/t/'+topic.id+'.json?include_raw=1')
        .then((response)=>{
          var topic = response.data;
          var tmp = {};

          tmp['id'] = topic['id'];
          tmp['routeName'] = topic['title'].split(" ")[1];
          tmp['title'] = topic['title'].split(" ")[0];
          tmp['catas'] = topic['tags'];
          tmp['likes'] = topic['views']
          tmp['lastat'] = topic['last_posted_at']

          var firstPost = topic.post_stream.posts[0];
          var lastPost = topic.post_stream.posts.slice(-1)[0];

          tmp['slogan'] = /slogan *: *(.*)/g.exec(firstPost.raw)[1];
          tmp['status'] = (firstPost.id===lastPost.id) ? "即將開始" : lastPost.raw.split(" ")[0];
          if(tmp['status'] === "意見徵集") {
            tmp['progress'] = this.getProgress(lastPost.raw);
            tmp['total'] = this.getTotal(lastPost.raw);
          }

          tmp['owner'] = /@(\w+)/g.exec(firstPost.raw)[1];
          tmp['cover'] = /cover *: *(.*)/g.exec(firstPost.raw)[1];

          this.allTopics.push(tmp);

        })
      })
    })

    caxios.get('https://talk.vtaiwan.tw/posts/2094.json?include_raw=1')
    .then((response)=>{
      var configs = response.data.raw.split('\n')
      configs.forEach((config)=>{
        var tmp = {};
        tmp['t'] = config.split(" ")[0];
        tmp['routeName'] = config.split(" ")[1];
        tmp['cover'] = config.split(" ")[2];
        this.catagories.push(tmp);
      })
    })

    caxios.get('https://talk.vtaiwan.tw/t/facebook/1249/last.json?include_raw=1') //news
    .then((response)=>{
      var news = response.data;
      news = news['post_stream']['posts'].slice(1);

      news.forEach((post)=>{
        var tmp = {};
        var tag = {};
        var tags = [];
        post = post['raw'].split("<br>");
        var tag_tmp = post[9].split("\n");
        tmp['title'] = post[1];
        tmp['content'] = post[3];
        tmp['img_link'] = post[5];
        tmp['source'] = post[7];
        for(var i in tag_tmp){
          if(tag_tmp[i]!="【新聞快遞】" && tag_tmp[i].indexOf("http") == -1 ){
            tag = tag_tmp[i].replace(/，|#|、|\//g," ");
            tag = tag.split(" ");
            for(var j in tag){
              if(tag[j]!=""){
                tags.push(tag[j]);
              }
            }
          }
        }
        tmp['tags'] = tags;
        tmp['news_link'] = post[11];
        tmp['source_link'] = post[11].split("/")[2];
        tmp['setup_time'] = post[13];
        this.allNews.push(tmp);
      })
      this.allNews.sort(function(a,b){
        return new Date(b.setup_time).getTime() - new Date(a.setup_time).getTime();
      })
    })

    caxios.get('https://talk.vtaiwan.tw/t/around-the-globe/1258/last.json?include_raw=1') //重要觀測
    .then((response)=>{
      var info = response.data;
      info = info['post_stream']['posts'].slice(1);
      var reg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}/g;
      info.forEach((post)=>{
        var tmp ={};
        var postt = post['raw'].split("<br>");
        tmp['title'] = postt[1];
        tmp['category'] = postt[3].substring(3);
        tmp['region'] =postt[4].substring(3);
        tmp['year'] = postt[5].substring(3);
        tmp['author'] = postt[6].substring(3);
        tmp['organization'] = postt[7].split("\n")[0].substring(10);
        tmp['link'] = postt[7].split("\n\n")[1];
        tmp['publish_date'] = postt[8].substring(5).match(reg)[0];
        tmp['content'] = post["cooked"].split("<br>")[11];
        this.allInfo.push(tmp);
        this.allInfo.sort(function(a,b){
          return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
        })
      })
    })

  }
}

</script>

<style lang="scss" >

@import "./sass/global.scss";

.app {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  @include transition(border-color 0.5s ease);
  &.join {    border-color: $join  }
  &.intro {   border-color: $intro  }
  &.live {    border-color: $live  }
  &.track {   border-color: $track  }
}

.main {
  position: relative;
  top: 0;
  width: 100%;
  // text-align: center;
}

</style>
