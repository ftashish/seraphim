new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Eyes that sparkle like stars. ",
          artist: "Naina",
          cover: "img/sath.jpg",
          source: "mp3/1.mp3",
          url: "https://youtu.be/9IzaWBsUhCU?si=tyk20H8HIYi7xPPC",
          favorited: false
        },
        {
          name: "Die with memories, not dreams ",
          artist: "Khol de Baahein",
          cover: "img/2.jpeg",
          source: "mp3/2.mp3",
          url: "https://youtu.be/aGKWjgWaIX4?si=mZ7Xikc4OrUvXqJWK",
          favorited: true
        },

        {
          name: "The love we give away is the only love we keep",
          artist: "Malharile",
          cover: "img/3.jpeg",
          source: "mp3/3.mp3",
          url: "https://youtu.be/pY3doyFo1CY?si=k-wRAgHp2IuM8SS6",
          favorited: false
        },

        {
          name: "Love deeply, live simply",
          artist: "Tum Jo Aaye",
          cover: "img/4.jpeg",
          source: "mp3/4.mp3",
          url: "https://youtu.be/kTXilT_KbUM?si=5iOlSa1r9CQZ4xwL",
          favorited: false
        },
        {
          name: "You call it madness, but I call it ",
          artist: "Unwritten",
          cover: "img/5.jpeg",
          source: "mp3/5.mp3",
          url: "https://www.youtube.com/watch?v=Amq-qlqbjYA&ab_channel=BLACKPINK",
          favorited: true
        },
        {
          name: "You are enough. Believe it",
          artist: "Spring Snow",
          cover: "img/6.png",
          source: "mp3/6.mp3",
          url: "https://youtu.be/SKWxqYvqmmA?si=uhCXqkMWn99cKa5q",
          favorited: false
        },
        {
          name: "Be someone's rainbow today",
          artist: "Mukilai",
          cover: "img/7.jpeg",
          source: "mp3/7.mp3",
          url: "https://youtu.be/tzzoFXq_kSY?si=n3_wcPGvfboA2eZz",
          favorited: true
        },
        {
          name: "Love wins, always and forever",
          artist: "I Can Do It With A Broken Heart",
          cover: "img/8.png",
          source: "mp3/8.mp3",
          url: "https://youtu.be/i8_w_m6HLJ0?si=fo1O0lPSvHPqKe5n",
          favorited: false
        },
        {
          name: "Happy New Year",
          artist: "Sajda",
          cover: "img/images.jpeg",
          source: "mp3/9.mp3",
          url: "https://youtu.be/QELLdNrdYnU?si=5nEaEWVai9xVYayu",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});
