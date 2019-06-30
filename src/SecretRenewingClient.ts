import { ApolloClient } from 'apollo-client';
import Renewer from './helper/Renewer';
import { isAuthenticationError } from './utils';

import { ApolloClientOptions, ApolloQueryResult } from 'apollo-client';
import { SecretOptionsType } from './type';

export default
class SecretRenewingClient<C = any, S = any> extends ApolloClient<C> {
    _options: SecretOptionsType<S>;
    _renewer: Renewer<C, S>;

    constructor(options: ApolloClientOptions<C> & { secret: SecretOptionsType<S> }) {
        const { secret, ...rest } = options;
        super(rest);
        this._options = secret;
        this._renewer = new Renewer(this, secret);

        const currentSecret = secret.getter();
        if (currentSecret !== null) {
            this._renewer.start(currentSecret);
        }
    }

    async resetStore(): Promise<ApolloQueryResult<any>[] | null> {
        try {
            return await super.resetStore();
        } catch (e) {
            if (!isAuthenticationError(e)) {
                throw e;
            }

            return null;
        }
    }

    async clearStore(): Promise<any[]> {
        try {
            return await super.clearStore();
        } catch (e) {
            if (!isAuthenticationError(e)) {
                throw e;
            }

            return [];
        }
    }

    setSecret(secret: S) {
        this._options.setter(secret);
        if (secret === null) {
            this._renewer.stop();
        } else {
            this._renewer.start(secret);
        }
    }
}
