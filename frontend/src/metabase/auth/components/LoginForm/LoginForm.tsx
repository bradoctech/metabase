import { useMemo } from "react";
import { t } from "ttag";
import * as Yup from "yup";

import {
  Form,
  FormCheckbox,
  FormErrorMessage,
  FormProvider,
  FormSubmitButton,
  FormTextInput,
} from "metabase/forms";
import * as Errors from "metabase/lib/errors";

import type { LoginData } from "../../types";

const LOGIN_SCHEMA = Yup.object().shape({
  username: Yup.string()
    .required(Errors.required)
    .when("$isLdapEnabled", {
      is: false,
      then: (schema) => schema.email(Errors.email),
    }),
  password: Yup.string().required(Errors.required),
  remember: Yup.boolean(),
});

interface LoginFormProps {
  isLdapEnabled: boolean;
  hasSessionCookies: boolean;
  onSubmit: (data: LoginData) => void;
}

export const LoginForm = ({
  isLdapEnabled,
  hasSessionCookies,
  onSubmit,
}: LoginFormProps): JSX.Element => {
  const initialValues = useMemo(
    () => ({
      username: "",
      password: "",
      remember: !hasSessionCookies,
    }),
    [hasSessionCookies],
  );

  const validationContext = useMemo(
    () => ({
      isLdapEnabled,
    }),
    [isLdapEnabled],
  );

  return (
    <FormProvider
      initialValues={initialValues}
      validationSchema={LOGIN_SCHEMA}
      validationContext={validationContext}
      onSubmit={onSubmit}
    >
      <Form>
        <FormTextInput
          name="username"
          label={
            isLdapEnabled ? t`Username or email address` : t`Email address`
          }
          type={isLdapEnabled ? "input" : "email"}
          placeholder="seuemail@sp.gov.br"
          autoFocus
          mb="1.25rem"
        />
        <FormTextInput
          name="password"
          label={t`Password`}
          type="password"
          placeholder="Sua senha"
          mb="1.25rem"
        />
        {!hasSessionCookies && (
          <FormCheckbox name="remember" label={t`Remember me`} mb="1.25rem" />
        )}
        <FormSubmitButton
          label={t`Sign in`}
          variant="primary"
          w="100%"
          radius="100px"
        />
        <FormErrorMessage mt="1rem" />
      </Form>
    </FormProvider>
  );
};
