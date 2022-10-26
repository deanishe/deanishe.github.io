
(function(wd) {

  if (wd.iTunes2Rss) return;

  const loadPodcastData = (id) => {
    let script = document.createElement('script');
    script.src = `https://itunes.apple.com/lookup?id=${id}&callback=iTunes2Rss_handlePayload`;
    document.body.appendChild(script);
  };

  const extractRssUrl = (data) => {
    if (data && data.results) {
      for (let i = 0; i < data.results.length; i++) {
        let pod = data.results[i];
        if (pod.feedUrl) return pod.feedUrl;
      }
    }
    return null;
  };

  const extractId = (s) => {
    let regexes = [
      /\/id(\d+)\/?/,
      /^(\d+)$/,
    ];
    for (let i = 0; i < regexes.length; i++) {
      let rx = regexes[i];
      let m = s.match(rx)
      if (m) return m[1];
    }
    return null;
  };

  wd.iTunes2Rss = function(selector) {
    let root = document.querySelector(selector);
    if (!root) throw new Error(`iTunes2Rss: element not found: ${selector}`);

    const notification = document.querySelector(`${selector} .notification`);
    const podcastForm = document.querySelector(`${selector} .podcast-form`);
    const podcastId = document.querySelector(`${selector} .podcast-id`);
    const feedUrl = document.querySelector(`${selector} .feed-url`);
    const findButton = document.querySelector(`${selector} .find-button`);
    const copyButton = document.querySelector(`${selector} .copy-button`);

    const notify = (msg) => { notification.innerText = msg };

    const handlePayload = (data) => {
      let rssUrl = extractRssUrl(data);
      console.debug(`rssUrl=${rssUrl}`);
      if (rssUrl) {
        feedUrl.value = rssUrl;
        feedUrl.focus();
        feedUrl.select();
        copyButton.disabled = false;
      }
    };
    wd.iTunes2Rss_handlePayload = handlePayload;

    podcastForm.onsubmit = () => false;

    findButton.onclick = function() {
      feedUrl.value = '';
      let id = extractId(podcastId.value);
      if (!id) {
        notify('do not understand input');
        return;
      }
      console.debug(`id=${id}`);
      podcastId.value = id;
      loadPodcastData(id);
    }

    copyButton.onclick = function() {
      let rssUrl = feedUrl.value;
      navigator.clipboard.writeText(rssUrl)
        .then(() => notify('copied!'));
    };

    copyButton.disabled = true;
    feedUrl.value = '';
    podcastId.focus();
  };

})(window);
