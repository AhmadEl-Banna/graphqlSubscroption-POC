import express from 'express';
import graphqlSchema from './schema';
import cors from 'cors';
import {GRAPHQL_PORT} from './config';
import bodyParser from 'body-parser';
import { graphiqlExpress ,graphqlExpress} from 'graphql-server-express';
import { formatError } from 'apollo-errors';
import {connection} from './mongooseConnection';


const app = express();
app.use(cors());

async function Authorize(req, res, next) {
  try {
    const token = req.headers.token || req.body && req.body.variables && req.body.variables.token;
    if (token) {
    //   req.user = Auth.verify(token);
    //   console.log(req.user);
    }
    next();
  } catch (error) {
    // console.log(error);
    next();
  }
}
app.use(bodyParser.json());
app.use('/graphql', Authorize);
app.use('/graphql', graphqlExpress(request => ({
  pretty: true,
  schema: graphqlSchema,
  formatError,
  context: { user: request.user },
})));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

connection.once('open', () => app.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
)));
