import mongoose from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';

// this is just a sample for user 

export const UserSchema = new mongoose.Schema({
  name: { type:String , unique:true}, // standard types
  age: {
    type: Number,
    index: true,
  },
  contacts: { // another mongoose way for providing embedded documents
    email: String,
    phones: [String], // array of strings
  },
  gender: { // enum field with values
    type: String,
    enum: ['male', 'female', 'ladyboy'],
  },
}, {
  collection: 'users',
});

export const User = mongoose.model('User', UserSchema);

export const UserTC = composeWithMongoose(User);


export const ConversationSchema = new mongoose.Schema({
  user1:UserSchema,
  user2:UserSchema,
  hasNew : {
      type:Boolean
  }
}, {
  collection: 'conversations',
});

export const Conversation = mongoose.model('Conversation',ConversationSchema)

export const ConversationTc = composeWithMongoose(Conversation);

export const MessageSchema = new mongoose.Schema({
  conversationID : mongoose.SchemaTypes.ObjectId,
  text:String,
  time:Date
}, {
  collection: 'messages',
});



export const Message = mongoose.model('Message',MessageSchema);
export const MessageTc = composeWithMongoose(Message);

MessageTc.addRelation( // GraphQL relation definition
  'conversation',
  () => ({
    resolver: ConversationTc.getResolver('findById'),
    args: {
      filter: source => ({ _id: `${source.conversationID}` }),
    },
    projection: { conversationID: true },
  })
);

ConversationTc.addRelation(
  'messages',
  () => ({
    resolver: MessageTc.getResolver('findMany'),
    args: {
      filter: source => ( { filter: { conversationID:`${source._id}`} }),
    }
  })
)
