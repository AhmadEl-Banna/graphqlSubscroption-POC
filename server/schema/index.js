import {UserTC ,ConversationTc , MessageTc} from '../models/chat';
import customBuildSchema from './customBuildSchema';
import { ComposeStorage } from 'graphql-compose';
const GQC = new ComposeStorage();

GQC.rootQuery().addFields({
  userById: UserTC.getResolver('findById'),
  userMany: UserTC.getResolver('findMany'),
  userTotal: UserTC.getResolver('count'),
  messages: MessageTc.getResolver('findMany'),
  conversations : ConversationTc.getResolver('findMany'),
  conversationById : ConversationTc.getResolver('findById')
});

// GQC.get("Subscription").addFields({
//   PostSubscription: {
//     type: PostTC.getType(),
//     description: "Subscribe to my Post",
//     resolve: (payload, args) => {
//       console.log(args);
//       console.log(payload);
//       return payload;
//     }
//   }
// });

GQC.rootMutation().addFields({
  userCreate: UserTC.getResolver('createOne'),
  userUpdateById: UserTC.getResolver('updateById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
});



const graphqlSchema = customBuildSchema(GQC);
export default graphqlSchema;