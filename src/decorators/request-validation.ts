/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-types */

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { HttpResponse } from "@src/presentation/protocols";

export function RequestValidation(validateShape: {
  new (...args: any[]): object;
}) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<Function>
  ) => {
    const originalControllerMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<HttpResponse> {
      const [request] = args;

      const obj = plainToInstance(validateShape, request);

      const errors = await validate(obj);

      if (errors.length > 0) {
        return {
          statusCode: 400,
          body: {
            code: "validation.parameters",
            message: errors.reduce((acc, curr) => {
              return {
                ...acc,
                [curr.property]: Object.values(curr.constraints).join(", "),
              };
            }, {}),
          },
        };
      }

      return originalControllerMethod.apply(this, args);
    };
  };
}
