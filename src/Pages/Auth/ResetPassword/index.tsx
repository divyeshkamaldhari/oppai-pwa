import { Button, Form, Input } from "antd";

import { useAppDispatch } from "../../../redux";
import { forgotPassword } from "../../../redux/slices/authSlice";

const ResetPassword = () => {
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
                <h1 className="text-center font-luckiest-guy text-4xl font-bold tracking-wider text-white">Set your password?</h1>
                <Form className="mt-6" form={form} layout="vertical" requiredMark={customizeRequiredMark} onFinish={onFinish}>
                    <Form.Item
                        label={<span className="!font-poppins text-sm font-medium text-white"> New Password </span>}
                        name="newPassword"
                        rules={[
                            { required: true, message: "Please enter your new password!" },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                message: "Password must be 8+ characters, include uppercase, lowercase, and a number.",
                            },
                        ]}
                    >
                        <Input.Password className="!rounded-md !border-[#999999] !bg-transparent !px-4 !py-2.5 !font-poppins !text-base !leading-9 !text-white focus-within:!border-[#5217BA] focus-within:!bg-transparent hover:!border-[#5217BA] hover:!bg-transparent focus:!border-[#5217BA] focus:!bg-transparent [&.ant-input-status-error]:!border-[#ff4d4f] [&.ant-input-status-error]:!bg-transparent [&.ant-input-status-error]:!text-[#ff4d4f] [&.ant-input-status-error]:focus-within:!border-[#ff4d4f] [&.ant-input-status-error]:hover:!border-[#ff4d4f] [&.ant-input-status-error]:focus:!border-[#ff4d4f] [&_input]:!h-auto [&_svg]:!fill-white" />
                    </Form.Item>
                    <Form.Item
                        dependencies={["newPassword"]}
                        label={<span className="!font-poppins text-sm font-medium text-white">Confirm New Password</span>}
                        name="confirmPassword"
                        rules={[
                            { required: true, message: "Please confirm your new password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error("Passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password className="!rounded-md !border-[#999999] !bg-transparent !px-4 !py-2.5 !font-poppins !text-base !leading-9 !text-white focus-within:!border-[#5217BA] focus-within:!bg-transparent hover:!border-[#5217BA] hover:!bg-transparent focus:!border-[#5217BA] focus:!bg-transparent [&.ant-input-status-error]:!border-[#ff4d4f] [&.ant-input-status-error]:!bg-transparent [&.ant-input-status-error]:!text-[#ff4d4f] [&.ant-input-status-error]:focus-within:!border-[#ff4d4f] [&.ant-input-status-error]:hover:!border-[#ff4d4f] [&.ant-input-status-error]:focus:!border-[#ff4d4f] [&_input]:!h-auto [&_svg]:!fill-white" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className="h-max w-full rounded-full bg-[#CE2A42] px-5 py-3 !font-poppins text-base font-semibold leading-8 hover:!bg-[#CE2A42] hover:!bg-opacity-80 active:!bg-[#CE2A42]"
                            htmlType="submit"
                            type="primary"
                        >
                            Set Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ResetPassword;
