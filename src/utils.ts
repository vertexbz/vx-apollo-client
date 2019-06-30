import { ApolloError } from 'apollo-client';
import { ApolloLink, Operation, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';

export const isAuthenticationError = (e: ApolloError | any) => {
    return e && e.graphQLErrors && e.graphQLErrors.some((e: any) => e && e.extensions && e.extensions.code === 'UNAUTHENTICATED');
};

const testSubscription = ({ query }: Operation): boolean => {
    const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
    return kind === 'OperationDefinition' && operation === 'subscription';
};

export const splitSubscriptions = (httpLink: ApolloLink, wsLink: ApolloLink) => split(testSubscription, wsLink, httpLink);
