<style scoped lang="scss">
  @import "../sass/global.scss";
  .component {
    padding: 2em 0;
  }
</style>

<template lang="jade">
  .component
    .ui.container

      h1.ui.center.aligned.icon.header 
        i.circular.idea.icon
        | vTaiwan 是什麼？

      .ui.left.aligned.text.container

        p 這是一個討論法規該如何制定或修改的平台，透過彼此的意見交流，希望能夠產出符合各利益關係人期待，也貼近實際需求的法規內容。

      h1.ui.center.aligned.icon.header 
        i.circular.hand.rock.icon
        | 為什麼要參與 vTaiwan？

      .ui.left.aligned.text.container

        p 法律規定了社會上每個人的權利與義務，因此法規應該具備哪些內容，不只是行政機關，或是立法部門的工作，而是與每個人都切身相關。
        p 此外，越多利益關係人加入討論，就能夠讓法規的內容越完整周延，避免出現權益受到影響、但意見又無法表達的矛盾狀況。簡單來說，參與 vTaiwan，不只能夠照顧到自己的權益，同時也是在幫助每一個可能的利益關係人。

      h1.ui.center.aligned.icon.header 
        i.circular.announcement.icon
        | 在 vTaiwan 表達意見有什麼用？

      .ui.left.aligned.text.container
        p 首先，全部的意見都是公開閱覽，除了行政機關與法規制定機關必須閱讀以外，所有的參與者也可以從不同的意見中，增進彼此的相互理解與建立對議題更深入的思考。
        p 其次，行政機關或法規制定機關必須彙整所有的意見，並納入決策的討論過程。針對意見中的疑問或建議，機關要在一定時間內提出回覆。當法規修改內容確定後，也要說明具體採納了哪些意見。對於未採納的意見，機關也必須回應目前無法實行的理由。
        p 感謝 #[a(href='http://g0v.tw') g0v] vTaiwan.tw 專案參與者的共同建置、國發會法制協調中心與資策會科技法律研究所的協力支援，以及所有參與者的意見貢獻。

</template>

<script>
export default {
  name: 'Comment',
  data () {
    return {
      data : '...'
    }
  }
}
</script>

