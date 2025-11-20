import { Button, Form, Input } from "antd";
import { Link } from "react-router";

import { forgotPassword, resteConfirm } from "../../../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { APP_ROUTE } from "../../../constants/AppRoutes";
import BackArrow from "../../../assets/Icons/BackArrow";

const ForgotPassword = () => {
    const { forgotPasswordError, forgotPasswordComplete } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const customizeRequiredMark = (label: React.ReactNode) => (
        <>
            {label}
            <span className="ms-1 font-poppins text-sm font-medium text-red-700">*</span>
        </>
    );

    const onFinish = (values: { email: string }) => {
        dispatch(forgotPassword(values));
    };

    return (
        <div className="h-full w-full">
            <div className="mx-4 my-7 flex flex-col rounded-lg bg-[#2f2b42] px-4 py-7">
                {!forgotPasswordComplete && (
                    <>
                        <h1 className="text-center font-luckiest-guy text-[28px] leading-none font-medium tracking-wider text-white">Lost your password?</h1>
                        <p className="mt-4 text-center font-poppins text-white">
                            No worries, I’ll send you reset instructions via email. - Zoe, Creator of Oppai Dragon 💖{" "}
                        </p>
                    </>
                )}
                {forgotPasswordError && (
                    <div className="mt-4 border-s-4 border-[#ff4f55] bg-[#ff4f551a] p-2.5 text-[#ff030b]">
                        <span className="font-bold">ERROR:</span> {forgotPasswordError}
                    </div>
                )}
                {forgotPasswordComplete ? (
                    <div>
                        <div className="mt-4 border-s-4 text-base border-[#49c85f] bg-white p-2.5 text-[#026113]">
                            <span className="font-bold">Success:</span> Password reset email has been sent.
                        </div>
                        <div className="mt-4 text-center mx-4 font-poppins text-lg mb-8">
                            The password reset email may take several minutes to arrive. Please wait at least 10 minutes before attempting another reset.{" "}
                        </div>
                    </div>
                ) : (
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

                        <Form.Item>
                            <Button className="[&_.ant-btn-icon]:flex" htmlType="submit" type="primary">
                                Reset password
                            </Button>
                        </Form.Item>
                    </Form>
                )}
                <Link
                    className="mx-auto flex w-fit items-center justify-center gap-1 text-center !font-poppins text-sm !text-white transition-all hover:gap-2 hover:underline"
                    to={APP_ROUTE.LOGIN}
                    onClick={() => {
                        setTimeout(() => {
                            dispatch(resteConfirm());
                        }, 800);
                    }}
                >
                    <BackArrow /> Back
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
