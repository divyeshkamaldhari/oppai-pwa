import { Link, useNavigate } from "react-router";
import { Button, Checkbox, Form, Input } from "antd";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux";
import { APP_ROUTE } from "../../../constants/AppRoutes";
import { login, setLogin } from "../../../redux/slices/authSlice";

const Login = () => {
    const { loading, loginError } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const customizeRequiredMark = (label: React.ReactNode) => (
        <>
            {label}
            <span className="ms-1 font-poppins text-sm font-medium text-red-700">*</span>
        </>
    );

    const onFinish = async (values: { email: string; password: string }) => {
        const res = await dispatch(login(values));

        if (login.fulfilled.match(res)) {
            // if (res.payload.chat_purchase) {
            //     navigate(APP_ROUTE.CHAT);
            // } else {
            // }
            navigate(APP_ROUTE.VAULT);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            dispatch(setLogin({ token: token }));
        }
    }, []);

    // const handleLinkClick = (url: string) => {
    //     if (isPWA()) {
    //         window.open(url, "_blank", "noopener,noreferrer");
    //     } else {
    //         window.open(url, "_blank");
    //     }
    // };

    return (
        <div className="h-full w-full">
            <div className="mx-4 my-7 flex flex-col rounded-lg bg-[#2f2b42] px-4 py-7">
                <h1 className="text-center font-luckiest-guy text-[28px] leading-none font-medium tracking-wider text-white">Login</h1>
                {loginError && (
                    <div className="mt-4 border-s-4 border-[#ff4f55] bg-[#ff4f551a] p-2.5 text-[#ff030b]">
                        <span className="font-bold">ERROR:</span> {loginError}
                    </div>
                )}
                <Form className="mt-6" form={form} layout="vertical" requiredMark={customizeRequiredMark} onFinish={onFinish}>
                    <Form.Item
                        label={<span className="!font-poppins text-sm font-medium text-white">Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: "Enter your email, Otaku!" },
                            { type: "email", message: "Email not valid, Otaku!" },
                        ]}
                    >
                        <Input className="!rounded-md !border-[#999999] !bg-transparent !px-4 !py-2.5 !font-poppins !text-base !leading-9 !text-white focus-within:!border-[#5217BA] focus-within:!bg-transparent hover:!border-[#5217BA] hover:!bg-transparent focus:!border-[#5217BA] focus:!bg-transparent [&.ant-input-status-error]:!border-[#ff4d4f] [&.ant-input-status-error]:!bg-transparent [&.ant-input-status-error]:!text-[#ff4d4f] [&.ant-input-status-error]:focus-within:!border-[#ff4d4f] [&.ant-input-status-error]:hover:!border-[#ff4d4f] [&.ant-input-status-error]:focus:!border-[#ff4d4f]" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="!font-poppins text-sm font-medium text-white">Password</span>}
                        name="password"
                        rules={[{ required: true, message: "Enter your password, Otaku!" }]}
                    >
                        <Input.Password className="!rounded-md !border-[#999999] !bg-transparent !px-4 !py-2.5 !font-poppins !text-base !leading-9 !text-white focus-within:!border-[#5217BA] focus-within:!bg-transparent hover:!border-[#5217BA] hover:!bg-transparent focus:!border-[#5217BA] focus:!bg-transparent [&.ant-input-status-error]:!border-[#ff4d4f] [&.ant-input-status-error]:!bg-transparent [&.ant-input-status-error]:!text-[#ff4d4f] [&.ant-input-status-error]:focus-within:!border-[#ff4d4f] [&.ant-input-status-error]:hover:!border-[#ff4d4f] [&.ant-input-status-error]:focus:!border-[#ff4d4f] [&_input]:!h-auto [&_svg]:fill-white" />
                    </Form.Item>

                    <div className="mb-6 flex items-center justify-between">
                        <Form.Item noStyle name="remember" valuePropName="checked">
                            <Checkbox className="!font-poppins text-white">Remember Me</Checkbox>
                        </Form.Item>
                        <Link className="!font-poppins text-sm !text-white hover:underline" to={APP_ROUTE.FORGOT_PASSWORD}>
                            Lost your password?
                        </Link>
                    </div>

                    <Form.Item>
                        <Button className="[&_.ant-btn-icon]:flex" htmlType="submit" loading={loading} type="primary">
                            LOGIN
                        </Button>
                    </Form.Item>
                </Form>
                {/* <div aria-hidden={true} className="mb-6 items-center flex justify-center cursor-pointer" onClick={() => handleLinkClick(APP_ROUTE.SIGNUP)}>
                    <div className="!font-poppins text-sm !text-white hover:underline">No account yet?</div>
                </div> */}
            </div>
        </div>
    );
};

export default Login;
