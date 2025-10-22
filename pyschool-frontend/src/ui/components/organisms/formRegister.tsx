import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/ui/components/atoms/input";
import TitleAndDescr from "@/ui/components/molecules/titDesc"
import SignLink from '@/ui/components/atoms/txtSign';
import GoogleButton from "@/ui/components/atoms/btnGoogle";

const schema = z.object({
  firstname: z.string().min(3, "Firstname must be at least 3 characters"),
  lastname: z.string().min(3, "Lastname must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


type FormData = z.infer<typeof schema>;


const RegisterForm: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

    return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-lg space-y-4">
            <TitleAndDescr title="Register" descr="SingUp now to get full access to our app." />

          {/* Firstname + Lastname*/}
          <div className="flex gap-x-4">
            <div className=" w-1/2">
                <Controller
                    name="firstname" control={control} render={({ field }) => (
                    <Input
                        label="Firstname"
                        placeholder="Firstname"
                        value={field.value}
                        onChange={field.onChange}
                    />
                    )}
                />
                {errors.firstname && (
                    <p className="text-xs text-red-700 mb-0 -mt-0 ml-1">{errors.firstname.message}</p>
                    )}
            </div>
            <div className="relative w-1/2">
                <Controller
                    name="lastname" control={control} render={({ field }) => (
                    <Input
                        label="Lastname"
                        placeholder="Lastname"
                        value={field.value}
                        onChange={field.onChange}
                    />
                    )}
                />
                {errors.lastname && (
                    <p className="text-xs text-red-700 mb-0 -mt-0 ml-1">{errors.lastname.message}</p>
                    )}
            </div>
          </div>

          {/* Email */}
          <Controller
            name="email" control={control} render={({ field }) => (
              <Input
                label="Email"
                placeholder="Email"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-700 mb-3 -mt-4 ml-1">{errors.email.message}</p>
            )}


          {/* Password */}
          <Controller
            name="password" control={control} render={({ field }) => (
              <Input
                label="Password"
                placeholder="Password"
                value={field.value}
                onChange={field.onChange}
                type="password"
              />
            )}
          />
          {errors.password && (
            <p className="text-xs text-red-700 mb-3 -mt-4 ml-1">{errors.password.message}</p>
            )}


          {/* Confirm Password */}
          <Controller
            name="confirmPassword" control={control} render={({ field }) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm password"
                value={field.value}
                onChange={field.onChange}
                className="w-full max-w-md"
                type="password"
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-700 mb-3 -mt-4 ml-1">{errors.confirmPassword.message}</p>
            )}
          
          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-900 py-2 text-white font-semibold"
          >
            Submit
          </button>
          <div className="flex justify-center">
            <GoogleButton/>
          </div>
          <div className="text-center mb-4">
            <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <SignLink
                text="Sign In"
                href="/signup"
                />
            </span>
            </div>          
        </div>
    </form>
  );
};

export default RegisterForm;