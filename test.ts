import 'reflect-metadata';
import {
  createModule,
  testkit,
  gql,
} from 'graphql-modules';

export const _hackKeepExtendWorking = {
    typeDefs: gql`
        type Query {
            foo: String!
        }
        type Mutation {
            bar: String!
        }
    `,
    resolvers: {
        Query: {
            foo() {
                return {
                    name: 'Bar',
                };
            },
        },
        Mutation: {
            bar() {
                return {
                    name: 'Foo',
                };
            },
        },
    },
};

describe('testModule', () => {

    const ListModule = createModule({
        id: 'list',
        typeDefs: gql`
            extend type Query {
                list: List!
            }
            type List {
                id: ID!
                title: String!
            }
        `,
        resolvers: {
            Query: {
                list() {
                    return {
                        id: '123-456-789',
                        title: 'foo'
                    };
                },
            }
        }
    });

    const ProductModule = createModule({
        id: 'product',
        typeDefs: gql`
            extend type Query {
                product: Product!
            }
            type Product {
                id: ID!
            }
            # this module extends on list
            extend type List {
                product: Product!
            }
        `,
        resolvers: {
            Query: {
                product() {
                    return {
                        id: '42',
                    };
                },
            },
            List: {
                product: () => {
                    return {
                        id: '42',
                    };
                }
            }
        }
    });

    test('should not throw error (it will)', () => {
        expect(() =>
        testkit.testModule(ProductModule, {
            replaceExtensions: true,
            inheritTypeDefs: [
                ListModule,
            ],
        })
        ).not.toThrow();
    });


    test('with hack i can make it work', async () => {

        const app = testkit.testModule(ProductModule, {
            ..._hackKeepExtendWorking,
            inheritTypeDefs: [
                ListModule,
            ],
        })

        const result = await testkit.execute(app, {
            document: gql`
                query product {
                    product {
                        id
                    }
                }
            `
        });

        expect(result.data.product.id).toBe('42');
    });
});
