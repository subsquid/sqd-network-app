import BigNumber from 'bignumber.js';
import {
  AnyObject,
  DefaultThunk,
  Defined,
  Flags,
  Maybe,
  Message,
  NotNull,
  Reference,
  Schema,
  ToggleDefault,
} from 'yup';

const messages = {
  min: '${path} must be greater than or equal to ${min}',
  max: '${path} must be less than or equal to ${max}',
  lessThan: '${path} must be less than ${less}',
  moreThan: '${path} must be greater than ${more}',
  positive: '${path} must be a positive number',
  negative: '${path} must be a negative number',
};

interface DecimalSchema<
  TType extends Maybe<BigNumber> = BigNumber | undefined,
  TContext = AnyObject,
  TDefault = undefined,
  TFlags extends Flags = '',
> extends Schema<TType, TContext, TDefault, TFlags> {
  default<D extends Maybe<TType>>(
    def: DefaultThunk<D, TContext>,
  ): DecimalSchema<TType, TContext, D, ToggleDefault<TFlags, D>>;

  defined(msg?: Message): DecimalSchema<Defined<TType>, TContext, TDefault, TFlags>;
  optional(): DecimalSchema<TType | undefined, TContext, TDefault, TFlags>;

  required(msg?: Message): DecimalSchema<NonNullable<TType>, TContext, TDefault, TFlags>;
  notRequired(): DecimalSchema<Maybe<TType>, TContext, TDefault, TFlags>;

  nullable(msg?: Message): DecimalSchema<TType | null, TContext, TDefault, TFlags>;
  nonNullable(msg?: Message): DecimalSchema<NotNull<TType>, TContext, TDefault, TFlags>;
}

class DecimalSchema<
  TType extends Maybe<BigNumber> = BigNumber | undefined,
  TContext = AnyObject,
  TDefault = undefined,
  TFlags extends Flags = '',
> extends Schema<TType, TContext, TDefault, TFlags> {
  constructor() {
    super({
      type: 'decimal',
      check(value: unknown): value is NonNullable<TType> {
        return value instanceof BigNumber && !value.isNaN();
      },
    });

    this.withMutation(() => {
      this.transform(value => {
        const res = BigNumber(value || 0);
        return res.isNaN() ? BigNumber(0) : res;
      });
    });
  }

  min(min: string | Reference<string> | BigNumber, message = messages.min) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: { min },
      skipAbsent: true,
      test(value: Maybe<BigNumber>) {
        return !!value?.gte(this.resolve(min));
      },
    });
  }

  max(max: string | Reference<string> | BigNumber, message = messages.max) {
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: { max },
      skipAbsent: true,
      test(value: Maybe<BigNumber>) {
        return !!value?.lte(this.resolve(max));
      },
    });
  }

  lessThan(less: string | Reference<string>, message = messages.lessThan) {
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: { less },
      skipAbsent: true,
      test(value: Maybe<BigNumber>) {
        return !!value?.lt(this.resolve(less));
      },
    });
  }

  moreThan(more: string | Reference<string>, message = messages.moreThan) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: { more },
      skipAbsent: true,
      test(value: Maybe<BigNumber>) {
        return !!value?.gt(this.resolve(more));
      },
    });
  }

  positive(msg = messages.positive) {
    return this.moreThan('0', msg);
  }

  negative(msg = messages.negative) {
    return this.lessThan('0', msg);
  }
}

export function decimal() {
  return new DecimalSchema();
}
