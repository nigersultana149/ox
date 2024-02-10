;(() => {
  function waitForElement(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector))
          observer.disconnect()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  }

  function getHost() {
    const sliceIndex = window.location.hostname.includes('co.uk') ? -3 : -2
    return window.location.hostname.split('.').slice(sliceIndex).join('.')
  }

  function onMakeChoice() {
    document.cookie = `cookie_warning_dismissed=true;domain=${getHost()};max-age=31536000;path=/`
  }

  function getPreviousChoice() {
    const cookieArray = document.cookie.split(';')
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < cookieArray.length; i++) {
      const cookieObj = cookieArray[i].split('=')
      const key = cookieObj[0].trim()
      if (key === 'cookie_warning_dismissed') {
        return decodeURIComponent(cookieObj[1])
      }
    }
    return ''
  }

  waitForElement('#cookie-banner').then(banner => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    })
    const debugMode = params.cb === 'true'
    const preview = params.preview === 'true'

    if ((getPreviousChoice() !== 'true' || debugMode) && !preview) {
      // eslint-disable-next-line no-param-reassign
      banner.style.display = 'block'
    }

    const acceptButton = document.getElementById('btn-accept-cookies')
    acceptButton.addEventListener('click', () => {
      document.cookie = `cookie_consent_granted=true;domain=${getHost()};max-age=31536000;path=/`
      onMakeChoice()
      banner.remove()
    })

    const declineButton = document.getElementById('btn-decline-cookies')
    declineButton.addEventListener('click', () => {
      onMakeChoice()
      banner.remove()
    })
  })
})()
