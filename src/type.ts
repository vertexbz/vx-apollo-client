import ApolloClient from 'apollo-client';

export type SecretOptionsType<S> = {
    getter: () => S | null,
    setter: (secret: null | S) => void,
    getExpiry: (secret: S) => Date,
    renew: (client: ApolloClient<any>, secret: S) => Promise<S | null>,
    renewBefore?: number
};
