(function () {
  function initPlayer(shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('.player-overlay');
    var status = shell.querySelector('.player-status');
    var stream = video ? video.getAttribute('data-stream') : '';
    var hlsInstance = null;
    var isReady = false;

    function setStatus(text) {
      if (status) {
        status.textContent = text || '';
      }
    }

    function playVideo() {
      if (!video) {
        return;
      }

      video.controls = true;
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          setStatus('请再次点击视频播放');
        });
      }
    }

    function prepare() {
      if (!video || !stream) {
        setStatus('视频暂不可用');
        return;
      }

      shell.classList.add('is-playing');

      if (isReady) {
        playVideo();
        return;
      }

      isReady = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
        video.load();
        playVideo();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('视频加载失败');
          }
        });
        playVideo();
        return;
      }

      setStatus('视频暂不可用');
    }

    if (overlay) {
      overlay.addEventListener('click', function (event) {
        event.preventDefault();
        prepare();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          prepare();
        }
      });
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
        setStatus('');
      });
      video.addEventListener('pause', function () {
        shell.classList.remove('is-playing');
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
})();
