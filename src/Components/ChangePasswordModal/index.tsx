import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";

import { changePassword } from "../../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux";
import LeftArrow from "../../assets/Icons/LeftArrow";
import Header from "../Header";

export interface IChangePasswordModal {
    open: boolean;
    handleOk: () => void;
}

const ChangePasswordModal: React.FC<IChangePasswordModal> = ({ handleOk, open }) => {
    const { changePasswordLoading, changePasswordError } = useAppSelector((state) => state.auth);
    const [success, setSuccess] = useState("");
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const customizeRequiredMark = (label: React.ReactNode) => (
        <>
            {label}
            <span className="ms-1 font-poppins text-sm font-medium text-red-700">*</span>
        </>
    );

    const handleCancle = () => {
        form.resetFields();
        setSuccess("");
        handleOk();
    };

    const onFinish = async (values: { oldPassword: string; newPassword: string }) => {
        const payload = {
            old_password: values.oldPassword,
            new_password: values.newPassword,
        };

        const res = await dispatch(changePassword(payload));

        if (changePassword.fulfilled.match(res)) {
            setSuccess("Password Changed Successfully.");
            setTimeout(() => {
                handleCancle();
            }, 1500);
        }
    };

    return (
        <Modal
            className="!top-0 !m-0 !mx-auto !h-dvh !w-full !max-w-md !bg-[#130C1E] !p-0 [&_.ant-modal-body]:bg-[#130C1E] [&_.ant-modal-content]:h-dvh [&_.ant-modal-content]:bg-transparent [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:text-white"
            closable={false}
            footer={null}
            open={open}
            title=""
        >
            <div className="flex h-full w-[initial] flex-col overflow-x-visible overflow-y-scroll text-white">
                <div className="overflow-hidden">
                    <div className="sticky top-0 z-50 flex w-full items-center">
                        <div aria-hidden className="pwa-back-btn-custom z-[51]" onClick={handleCancle}>
                            <LeftArrow />
                        </div>
                        <Header />
                    </div>
                    <div className="flex flex-col gap-y-4 overflow-hidden px-[16px] pb-[16px]">
                        <div className="my-7 flex flex-col rounded-lg bg-[#2f2b42] px-4 py-7">
                            <h1 className="text-center font-luckiest-guy text-[28px] leading-none font-medium tracking-wider text-white">Change password</h1>
                            {changePasswordError && (
                                <div className="mt-4 border-s-4 border-[#ff4f55] bg-[#ff4f551a] p-2.5 text-[#ff030b]">
                                    <span className="font-bold">ERROR:</span> {changePasswordError}
                                </div>
                            )}
                            {success && (
                                <div className="mt-4 border-s-4 border-[#1CBD43] bg-[#1CBD431a] p-2.5 text-[#1CBD43]">
                                    <span className="font-bold">Success:</span> {success}
                                </div>
                            )}
                            <Form className="mt-6" form={form} layout="vertical" requiredMark={customizeRequiredMark} onFinish={onFinish}>
                                <Form.Item
                                    label={<span className="!font-poppins text-sm font-medium text-white">Current Password</span>}
                                    name="oldPassword"
                                    rules={[{ required: true, message: "Enter your current password, Otaku!" }]}
                                >
                                    <Input.Password className="!rounded-md !border-[#999999] !bg-transparent !px-4 !py-2.5 !font-poppins !text-base !leading-9 !text-white focus-within:!border-[#5217BA] focus-within:!bg-transparent hover:!border-[#5217BA] hover:!bg-transparent focus:!border-[#5217BA] focus:!bg-transparent [&.ant-input-status-error]:!border-[#ff4d4f] [&.ant-input-status-error]:!bg-transparent [&.ant-input-status-error]:!text-[#ff4d4f] [&.ant-input-status-error]:focus-within:!border-[#ff4d4f] [&.ant-input-status-error]:hover:!border-[#ff4d4f] [&.ant-input-status-error]:focus:!border-[#ff4d4f] [&_input]:!h-auto [&_svg]:fill-white" />
                                </Form.Item>
                                <Form.Item
                                    dependencies={["oldPassword"]}
                                    label={<span className="!font-poppins text-sm font-medium text-white"> New Password </span>}
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: "Enter your new password, Otaku!" },
                                        {
                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                            message: "Password must be 8+ characters, include uppercase, lowercase, and a number.",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue("oldPassword") !== value) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error("New password cannot be the same as old password, Otaku!"));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password className="!rounded-md !border-[#999999] !bg-transparent !px-4 !py-2.5 !font-poppins !text-base !leading-9 !text-white focus-within:!border-[#5217BA] focus-within:!bg-transparent hover:!border-[#5217BA] hover:!bg-transparent focus:!border-[#5217BA] focus:!bg-transparent [&.ant-input-status-error]:!border-[#ff4d4f] [&.ant-input-status-error]:!bg-transparent [&.ant-input-status-error]:!text-[#ff4d4f] [&.ant-input-status-error]:focus-within:!border-[#ff4d4f] [&.ant-input-status-error]:hover:!border-[#ff4d4f] [&.ant-input-status-error]:focus:!border-[#ff4d4f] [&_input]:!h-auto [&_svg]:!fill-white" />
                                </Form.Item>
                                <Form.Item
                                    dependencies={["newPassword"]}
                                    label={<span className="!font-poppins text-sm font-medium text-white">Confirm New Password</span>}
                                    name="confirmPassword"
                                    rules={[
                                        { required: true, message: "Confirm your new password, Otaku!" },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue("newPassword") === value) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error("Passwords do not match, Otaku!"));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password className="!rounded-md !border-[#999999] !bg-transparent !px-4 !py-2.5 !font-poppins !text-base !leading-9 !text-white focus-within:!border-[#5217BA] focus-within:!bg-transparent hover:!border-[#5217BA] hover:!bg-transparent focus:!border-[#5217BA] focus:!bg-transparent [&.ant-input-status-error]:!border-[#ff4d4f] [&.ant-input-status-error]:!bg-transparent [&.ant-input-status-error]:!text-[#ff4d4f] [&.ant-input-status-error]:focus-within:!border-[#ff4d4f] [&.ant-input-status-error]:hover:!border-[#ff4d4f] [&.ant-input-status-error]:focus:!border-[#ff4d4f] [&_input]:!h-auto [&_svg]:!fill-white" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        className="h-max w-full rounded-full [&_.ant-btn-icon]:flex bg-[#CE2A42] px-5 py-3 !font-poppins text-base font-semibold leading-8 hover:!bg-[#CE2A42] hover:!bg-opacity-80 active:!bg-[#CE2A42]"
                                        htmlType="submit"
                                        loading={changePasswordLoading}
                                        type="primary"
                                    >
                                        Confirm change
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChangePasswordModal;
