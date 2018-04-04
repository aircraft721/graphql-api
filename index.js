const { GraphQLServer } = require('graphql-yoga');
const fetch = require('node-fetch');
const axios = require('axios');

const typeDefs = `
    type Query {
        getIndex(id: String!): Data
    }

    type Source {
        id: Int
        brand: String
        region: String
        language: String
        name: String
    }

    type Hits {
        _index: String
        _type: String
        _id: String
        _score: Int
        _source: Source
    }

    type Data {
        total: Int
        max_score: Int
        hits: [Hits]
    }
`;

const resolvers = {
    Hits: {
        _source: async parent => {
            console.log('parent of source', parent);
            const response = await fetch(parent._source);
            return response;
        }
    },
    Data: {
        hits: parent => {
            const promises = parent.hits.map(async hits => {
                const response = await fetch(hits);
                console.log('hits', response);
                return response;
            });
            return Promise.all(promises);
        }
    },
    Query: {
        getIndex: async (_, { id }) => {
            const response = await fetch(
                `https://qa.usva.api.elco.cloud/products-v0/${id}/_search/`
            );
            const x = await response.json();
            return x.hits;
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('server is running on localhost:4000'));
