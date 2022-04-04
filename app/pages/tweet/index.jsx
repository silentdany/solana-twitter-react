import Base from '../../templates/Base'
import { ref, watchEffect } from 'vue'
import { PublicKey } from '@solana/web3.js'
import { getTweet } from '@/api'
import { useFromRoute } from '@/composables'
import TweetCard from '@/components/TweetCard'

export default function Profile() {
  const tweetAddress = ref(null)
  useFromRoute((route) => (tweetAddress.value = route.params.tweet))

  const loading = ref(false)
  const tweet = ref(null)
  watchEffect(async () => {
    try {
      loading.value = true
      tweet.value = await getTweet(new PublicKey(tweetAddress.value))
    } catch (e) {
      tweet.value = null
    } finally {
      loading.value = false
    }
  })
  return (
    <Base>
      <div v-if="loading" className="p-8 text-center text-gray-500">
        Loading...
      </div>
      <div v-else-if="! tweet" className="p-8 text-center text-gray-500">
        Tweet not found
      </div>
      <tweet-card v-else tweet="tweet"></tweet-card>
    </Base>
  )
}