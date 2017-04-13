//We will need to add setup function for each subscription 
// and we need to publish new event via the exported pubsub handler inside the mutation
import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import schema from './schema';

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    chatMessageAdded: (options, args) => ({
      commentAdded: message => message,
    }),
  },
});

export { subscriptionManager, pubsub };