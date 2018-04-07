const { GraphQLServer } = require('graphql-yoga');
const fetch = require('node-fetch');
require('isomorphic-fetch');

const typeDefs = `
    type Query {
        getAllData(id: String = "1-bb-mx-es"): Data!
        getSource(id: String = "1-bb-mx-es"): [Source]!
    }

    type Flag {
        sized: Boolean
        shaded: Boolean
        sold_out: Boolean
        coming_soon: Boolean
        palette: Boolean
        shoppable: Boolean
        displayable: Boolean
    }

    type SkuFlag {
        orderable: Boolean!
        shoppable: Boolean!
        limited_remaining: Boolean!
        displayable: Boolean!
        promotional: Boolean!
        waitlistable: Boolean!
        discountable: Boolean!
        donation: Boolean!
        hazmat: Boolean!
        restricted: Boolean!
        refillable: Boolean!
        searchable: Boolean!
    }

    type InventoryStatusFlag {
        active: Boolean!
        out_of_stock: Boolean!
        do_not_display: Boolean!
        inactive: Boolean!
        promotional: Boolean!
        sold_out: Boolean!
        coming_soon: Boolean!
    }

    type SkusCategories {
        id: Int!
        parent_id: Int!
        url: String!
    }

    type Skus {
        id: Int!
        brand: String!
        region: String!
        language: String!
        sku_type: String!
        product_id: Int
        product_code: String!
        parent_category_id: Int!
        categories: [SkusCategories]
        display_name: String!
        display_order: Int!
        display_status: Int!
        display_status_label: [String!]
        hex_value: String!
        inventory_status: Int!
        inventory_status_label: String!
        inventory_status_flag: InventoryStatusFlag!
        label: String!
        shade_name: String!
        shade_description: String!
        status_update_override: Boolean!
        price: Int!
        strikethrough_price: Int!
        product_size: String!
        unit_size: Int!
        flag: SkuFlag!
        modified: String!
    }

    type CategoriesDescriptionHtml {
        main: String!
    }

    type Categories {
        description_html: CategoriesDescriptionHtml
        name: String!
        product_url: String!
        display_order: Int!
        id: Int!
        parent_id: Int!
        url: String!
    }

    type Videos {
        name: String!
        title: String!
        file: String!
    }

    type Testimonial {
        location: String
        source: String
        product: String
    }

    type PriceRange {
        min: Int
        max: Int
    }

    interface Description {
        short: String
        what_it_is: String
        who_it_is_for: String
        why_it_is_different: String
        main: String
    }

    type Source {
        id: Int!
        brand: String!
        region: String!
        language: String!
        name: String!
        display_name: String!
        subheading: String
        description: Description!
        description_html: Description!
        meta_description: String
        usage: String
        url: String!
        default_category_id: Int
        parent_category_id: Int
        flag: Flag
        keywords: String
        meta_keywords: String
        family_code: String
        number_of_alt_images: Int
        price_range: PriceRange
        works_with_sku_ids: [Int!]!
        testimonial: Testimonial
        videos: [Videos!]!
        tips: String
        categories: [Categories]
        skus: [Skus]
        modified: String!
        display_status: Int!
        display_status_label: [String!]
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
        _source: parent => {
            return parent._source;
        }
    },
    Data: {
        hits: parent => {
            const response = parent.hits.map(hits => {
                return hits;
            });
            return response;
        }
    },
    Query: {
        getAllData: (_, { id }) => {
            return fetch(
                `https://qa.usva.api.elco.cloud/products-v0/${id}/_search/`
            )
                .then(res => res.json())
                .then(res => res.hits);
        },
        getSource: (_, { id }) => {
            return fetch(
                `https://qa.usva.api.elco.cloud/products-v0/${id}/_search/`
            )
                .then(res => res.json())
                .then(res => res.hits)
                .then(res => res.hits.map(source => source._source))
        },
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('server is running on localhost:4000'));
