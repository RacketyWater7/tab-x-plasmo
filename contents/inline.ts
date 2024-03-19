const populateMessage = () => {
  const url = window.location.href
  chrome.storage.sync.get(["savedQuery"], function (data) {
    if (url.includes("chat.openai.com") && data?.savedQuery?.length > 0) {
      const query = data.savedQuery

      // Create a MutationObserver instance
      const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            const input = document.querySelector("textarea")
            if (input) {
              input.value = query
              input.dispatchEvent(new Event("input", { bubbles: true }))
              input.dispatchEvent(new Event("change", { bubbles: true }))
              observer.disconnect()
              // remove the message from storage
              chrome.storage.sync.remove(["savedQuery"])
            }
          }
        }
      })

      // Start observing the document with the configured parameters
      observer.observe(document, { childList: true, subtree: true })
    }
  })
}

populateMessage()
