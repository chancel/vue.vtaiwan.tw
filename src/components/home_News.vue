<template lang="jade">
.component

  .ui.horizontal.divider
    i.eye.icon
    |  news

  .ui.container

    .swiper-container1
      .swiper-pagination
      .swiper-wrapper
        a.swiper-slide.ui.centered.card(v-for="(n,idx) in allNews", :href="n.news_link", target='_blank')
          .image(v-if="n.img_link === 'undefined'", :style='"background-image: url(/vTaiwan_logo_2017.png)"')
          .image(v-else, :style='"background-image: url(" + n.img_link + ")"')
          .content
            .header
              h3 {{n.title}}
            p {{n.source}}
          .extra.content
              .ui.teal.label(v-for="t in n.tags")
                | {{t}}

</template>

<script>
export default {
  name: 'News',
  props:['allNews'],
  mounted: function () {
    this.ellipsis()
    setTimeout( () => {
      /* initialize swiper when document ready */
      var mySwiper1 = new Swiper ('.swiper-container1', {
        observer: true,
        direction: 'horizontal',
        pagination: '.swiper-pagination',
        autoplay: 5000,
        paginationClickable: true,
        slidesPerView: 4,
        spaceBetween: 20,
        grabCursor: true,
        breakpoints: {
          767: {
            slidesPerView: 1
          }
        }
      })
    }, 1500)

  },
  updated:function(){
      this.ellipsis()
  },
  methods: {
      ellipsis: function(){
        var len = 60; // exceed 60 characters
        $(".JQellipsis").each(function(i){
        if($(this).text().length>len){
            $(this).attr("title",$(this).text());
            var text=$(this).text().substring(0,len-1)+"...";
            $(this).text(text);
            }
        });
      }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/global.scss";
.ui.container {
  min-height: 15em;
  margin: 1em auto 2em auto;
  padding: 5px 1px; /* to prevent overlapped border */
  overflow: hidden;

  .ui.card{
    margin: 0;
    .image{
      background-position: center;
      background-size: cover;
      height: 12rem;
    }
    .content {
      text-align: justify;
      p {
        font-size: 50%;
      }
    }
    .extra.content {
      line-height: 1;
    }
  }

  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: -10px;
  }
}
</style>
