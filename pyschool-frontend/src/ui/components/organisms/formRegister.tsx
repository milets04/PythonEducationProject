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

  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    const apiRequestBody = {
      firstName: data.firstname,       
      lastName: data.lastname,       
      email: data.email,
      password: data.password,
      passwordConfirm: data.confirmPassword,
      roleId: 1
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequestBody),
      });

      // Obtener la respuesta del servidor
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar. Inténtalo de nuevo.');
      }
      console.log('Usuario registrado:', result);
      setSuccessMessage(result.message || '¡Registro exitoso!');

      localStorage.setItem('token', result.data.token);
      localStorage.setItem('userRole', result.data.user.role);

      // Redirigir al usuario al dashboard o al login
      // setTimeout(() => {
      //   router.push('/login'); // O '/dashboard'
      // }, 2000);


    } catch (error: any) {
      // Capturar errores (de red o de la API)
      console.error('Error en el registro:', error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [selected, setSelected] = useState("option1");

    return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-lg space-y-4">
        <TitleAndDescr title="Register" descr="SingUp now to get full access to our app." />

        {/* Firstname + Lastname*/}
        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-4">
          <div className="w-full sm:w-1/2">
            <Controller
              name="firstname" control={control} render={({ field }) => (
                <Input
                  label="Firstname"
                  placeholder="Firstname"
                  {...field}
                />
              )}
            />
            {errors.firstname && (
              <p className="text-xs text-red-700 mt-1 ml-1">{errors.firstname.message}</p>
            )}
          </div>
          <div className="w-full sm:w-1/2">
            <Controller
              name="lastname" control={control} render={({ field }) => (
                <Input
                  label="Lastname"
                  placeholder="Lastname"
                  {...field}
                />
              )}
            />
            {errors.lastname && (
              <p className="text-xs text-red-700 mt-1 ml-1">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <Controller
          name="email" control={control} render={({ field }) => (
            <Input
              label="Email"
              placeholder="Email"
              {...field}
              type="email"
            />
          )}
        />
        {errors.email && (
          <p className="text-xs text-red-700 -mt-3 ml-1">{errors.email.message}</p>
        )}


        {/* Password */}
        <Controller
          name="password" control={control} render={({ field }) => (
            <Input
              label="Password"
              placeholder="Password"
              {...field}
              type="password"
            />
          )}
        />
        {errors.password && (
          <p className="text-xs text-red-700 -mt-3 ml-1">{errors.password.message}</p>
        )}


        {/* Confirm Password */}
        <Controller
          name="confirmPassword" control={control} render={({ field }) => (
            <Input
              label="Confirm Password"
              placeholder="Confirm password"
              {...field}
              type="password"
            />
          )}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-700 -mt-3 ml-1">{errors.confirmPassword.message}</p>
        )}

        {apiError && (
          <div className="text-sm text-red-700 bg-red-100 p-3 rounded-lg text-center">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="text-sm text-green-700 bg-green-100 p-3 rounded-lg text-center">
            {successMessage}
          </div>
        )}
        

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-900 py-2.5 text-white font-semibold hover:bg-blue-800 disabled:bg-gray-400"
          disabled={isLoading} 
        >
          {isLoading ? 'Registrando...' : 'Submit'}
        </button>
        
        <div className="flex justify-center">
          <GoogleButton />
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