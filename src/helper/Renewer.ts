import { ApolloClient } from 'apollo-client';
import { isAuthenticationError } from '../utils';
import { SecretOptionsType } from '../type';

export default
class Renewer<C = any, S = any> {
    _options: SecretOptionsType<S>;
    _client: ApolloClient<C>;

    _timer: NodeJS.Timeout | null = null;

    constructor(client: ApolloClient<C>, options: SecretOptionsType<S>) {
        this._client = client;
        this._options = options;
    }

    stop() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    start(secret: S) {
        this.stop();
        if (secret) {
            const expiry = this._options.getExpiry(secret);

            const timeout = +expiry - +new Date() - (this._options.renewBefore || 5 * 60 * 1000);

            this._timer = setTimeout(async () => {
                if (this._timer) {
                    this._timer = null;

                    try {
                        this._options.setter(await this._options.renew(this._client, secret));
                    } catch (e) {
                        if (isAuthenticationError(e)) {
                            this._options.setter(null);
                        } else {
                            throw e;
                        }
                    }
                }
            }, timeout);
        }
    }
}
