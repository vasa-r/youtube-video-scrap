import { authApi } from "@/api/auth";
import { useAuth } from "@/context/auth-context";
import { LoginType, RegisterType } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginType) => authApi.login(data),
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterType) => authApi.register(data),
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
};
