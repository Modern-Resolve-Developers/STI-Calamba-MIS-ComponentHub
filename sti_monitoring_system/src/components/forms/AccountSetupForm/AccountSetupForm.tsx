import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import {
    Grid,
} from '@mui/material'
import { ControlledTextField } from "../../TextField/TextField";
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { useAtom } from "jotai";
import { AccountSetupAtom } from "../../../core/atoms/account-setup-atom";
import { usePreviousValue } from "../../../core/hooks/usePreviousValue";
import { ControlledCheckbox } from "../../Checkbox/Checkbox";
import { PasswordStrengthMeter } from "../../PasswordStrengthMeter/PasswordStrengthMeter";
import { accountSetupSubSchema, AccountSetupCreation } from "../../../core/schema/account-setup";
import { ControlledMobileNumberField } from "../../TextField/MobileNumberField";
import LoadBackdrop from "../../Backdrop/Backdrop";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApiCallback } from "../../../core/hooks/useApi";
import { Path } from "../../../router/path";
import { reusable_otp_page_identifier } from "../../../core/atoms/globals-atom";

const options = {
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);

const AccountSetupForm = () => {
    const {
        control, watch, resetField, trigger, getValues
    } = useFormContext<AccountSetupCreation>()
    const values = getValues()
    const hasNoMiddleName = watch('hasNoMiddleName')
    const streamPassword = watch('password')
    const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName)
    useEffect(() => {
        resetField('middleName')
        if(hasNoMiddleNamePrevValue){
            trigger('middleName')
        }
    }, [
        hasNoMiddleName,
        hasNoMiddleNamePrevValue,
        resetField,
        trigger
    ])
    useEffect(() => {}, [streamPassword])
    const result = zxcvbn(values.password == undefined ? "" : values.password);
    return (
        <>
            <Grid style={{justifyContent: 'center', marginTop : '10px'}} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3}}>
            <Grid item xs={4}>
            <ControlledTextField 
                    control={control}
                    required
                    shouldUnregister
                    name='firstName'
                    label='Firstname'
                />
            </Grid>
            <Grid item xs={4}>
                <ControlledTextField
                    control={control}
                    required={!hasNoMiddleName}
                    shouldUnregister
                    name="middleName"
                    label="Middlename"
                    disabled={hasNoMiddleName}
                />
                <ControlledCheckbox
                    control={control}
                    name="hasNoMiddleName"
                    label="I do not have a middlename"
                />
            </Grid>
            <Grid item xs={4}>
                <ControlledTextField
                    control={control}
                    required
                    shouldUnregister
                    name="lastName"
                    label="Lastname"
                />
            </Grid>
        </Grid>
        <Grid style={{justifyContent: 'center', marginTop : '10px'}} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3}}>
            <Grid item xs={4}>
                <ControlledTextField
                    control={control}
                    required
                    shouldUnregister
                    name="email"
                    label="Email"
                />
            </Grid>
            <Grid item xs={4}>
                <ControlledTextField
                    control={control}
                    required
                    shouldUnregister
                    name="username"
                    label="Username"
                />
            </Grid>
            <Grid item xs={4}>
                <ControlledMobileNumberField
                    control={control}
                    name='mobileNumber'
                    label='Mobile number'
                    required
                    shouldUnregister
                />
            </Grid>
        </Grid>
            <ControlledTextField
                control={control}
                required
                shouldUnregister
                name="password"
                label="Password"
                type="password"
            />
            <PasswordStrengthMeter result={result} />
            <ControlledTextField
                control={control}
                required
                shouldUnregister
                name="conpassword"
                label="Confirm Password"
                type="password"
            />
        </>
    )
}

export const AccountSetupAdditionalFormDetails = () => {
    const [accountsDetails, setAccountsDetails] = useAtom(AccountSetupAtom)
    const [loading, setLoading] = useState<Boolean>(false)
    const [contentLoad, setContentLoad] = useState<Boolean>(false)
    const [reuseOtp, setReuseOtp] = useAtom(reusable_otp_page_identifier)
    const form = useForm<AccountSetupCreation>({
        resolver: zodResolver(accountSetupSubSchema),
        mode: 'all',
        defaultValues: accountsDetails ?? { hasNoMiddleName : false }
    })
    const loadAccountSetup = useApiCallback(api => api.internal.AccountSetupFindAnyUsers())
    
    const apiCheckPrimaryDetails = useApiCallback(
        async (api, args: { email: string | undefined, username: string | undefined }) => await api.internal.checkPrimaryDetails(args)
    )
    
    function LoadAccountSetup(){
        loadAccountSetup.execute().then(res => {
            if(res?.data){
                setContentLoad(false)
                navigate(Path.login.path)
                setReuseOtp({currentScreen : 'none'})
            } else {
                setContentLoad(false)
                setReuseOtp({currentScreen : 'ac_setup'})
            }
        })
    }
    useEffect(() => {
        LoadAccountSetup()
    }, [])
    
    const {
        formState: { isValid },
        getValues
    } = form;
    const navigate = useNavigate()
    const handleContinue = () => {
        setLoading(!loading)
        const values = getValues()
        apiCheckPrimaryDetails.execute({
            email: values.email,
            username: values.username
        }).then(() => {
            setAccountsDetails(values)
            setLoading(false)
            navigate(Path.otp_entry_page.path)
        })
    }
    return (
        <>
            {contentLoad ? <LoadBackdrop open={contentLoad} />
            : 
            <div style={{
                margin: 0, padding: 0, overflow: 'hidden'
            }} className="rounded-sm h-screen border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-screen flex-wrap items-center">
              <div className="hidden w-full h-screen xl:block xl:w-1/2">
                <div className="py-17.5 px-26 mt-15 text-center">
                  <Link className="mb-5.5 inline-block" to="/">
                  <img src='/sti.png' alt='logo' style={{
                            borderRadius: '10px',
                            width: '100px',
                            height: '100px'
                        }} />
                  </Link>
                  <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Project Setup
                  </h2>
                  <p className="2xl:px-20">
                  <span style={{ fontWeight: 'bold'}}>System Initialization</span>: Begin your MIS experience by entering your essential details. Tailor the system to your needs for an efficient workflow.
                  </p>
    
                  <span className="mt-15 inline-block">
                   <svg xmlns="http://www.w3.org/2000/svg"  width="350"
                  height="350" viewBox="0 0 751.57 539.42"><path d="m19.9,538.23c0,.66.53,1.19,1.19,1.19h729.29c.66,0,1.19-.53,1.19-1.19s-.53-1.19-1.19-1.19H21.09c-.66,0-1.19.53-1.19,1.19Z" fill="#3f3d58"/><path d="m253.43,95.15H19.53c-8.92,0-16.18-7.26-16.18-16.18s7.26-16.18,16.18-16.18h233.9c8.92,0,16.18,7.26,16.18,16.18s-7.26,16.18-16.18,16.18ZM19.53,64.79c-7.82,0-14.18,6.36-14.18,14.18s6.36,14.18,14.18,14.18h233.9c7.82,0,14.18-6.36,14.18-14.18s-6.36-14.18-14.18-14.18H19.53Z" fill="#e2e3e4"/><path d="m253.43,284.5H19.53c-8.65,0-15.68-7.03-15.68-15.68s7.03-15.68,15.68-15.68h233.9c8.65,0,15.68,7.03,15.68,15.68s-7.03,15.68-15.68,15.68Z" fill="#6c63ff"/><path d="m176.78,31.36H15.68C7.03,31.36,0,24.33,0,15.68S7.03,0,15.68,0h161.1c8.65,0,15.68,7.03,15.68,15.68s-7.03,15.68-15.68,15.68Z" fill="#e2e3e4"/><path d="m253.43,158.43H19.53c-8.92,0-16.18-7.26-16.18-16.18s7.26-16.18,16.18-16.18h233.9c8.92,0,16.18,7.26,16.18,16.18s-7.26,16.18-16.18,16.18Zm-233.9-30.36c-7.82,0-14.18,6.36-14.18,14.18s6.36,14.18,14.18,14.18h233.9c7.82,0,14.18-6.36,14.18-14.18s-6.36-14.18-14.18-14.18H19.53Z" fill="#e2e3e4"/><path d="m253.43,221.72H19.53c-8.92,0-16.18-7.26-16.18-16.18s7.26-16.18,16.18-16.18h233.9c8.92,0,16.18,7.26,16.18,16.18s-7.26,16.18-16.18,16.18Zm-233.9-30.36c-7.82,0-14.18,6.36-14.18,14.18s6.36,14.18,14.18,14.18h233.9c7.82,0,14.18-6.36,14.18-14.18s-6.36-14.18-14.18-14.18H19.53Z" fill="#e2e3e4"/><path d="m11.49,51.17h61.3c1.46,0,2.65,1.18,2.65,2.65h0c0,1.46-1.19,2.65-2.65,2.65H11.49c-1.46,0-2.65-1.18-2.65-2.65h0c0-1.46,1.19-2.65,2.65-2.65Z" fill="#e2e3e4"/><path d="m11.49,115.95h61.3c1.46,0,2.65,1.18,2.65,2.64h0c0,1.46-1.19,2.65-2.65,2.65H11.49c-1.46,0-2.65-1.18-2.65-2.64h0c0-1.46,1.19-2.65,2.65-2.65Z" fill="#e2e3e4"/><path d="m11.49,180.74h61.3c1.46,0,2.65,1.18,2.65,2.65h0c0,1.46-1.19,2.64-2.65,2.64H11.49c-1.46,0-2.65-1.18-2.65-2.65h0c0-1.46,1.19-2.64,2.65-2.64Z" fill="#e2e3e4"/><g><polygon points="447.08 132.26 424.72 139.62 424.72 107.43 445.01 107.43 447.08 132.26" fill="#9f616a"/><circle cx="427.49" cy="94.06" r="22.28" fill="#9f616a"/><path d="m433.61,91.85c-3.73-.11-6.18-3.88-7.63-7.32s-2.94-7.39-6.4-8.81c-2.83-1.16-7.82,6.69-10.05,4.6-2.33-2.18-.06-13.37,2.41-15.38,2.47-2.01,5.85-2.4,9.03-2.55,7.76-.36,15.57.27,23.18,1.86,4.71.98,9.55,2.46,12.95,5.86,4.3,4.32,5.4,10.83,5.71,16.92.32,6.23-.04,12.75-3.07,18.2s-9.37,9.47-15.45,8.08c-.61-3.3.01-6.69.25-10.05.23-3.35-.01-6.97-2.06-9.64-2.04-2.67-6.42-3.73-8.8-1.36" fill="#2f2e43"/><path d="m461.02,99.57c2.23-1.63,4.9-3,7.64-2.66,2.96.36,5.47,2.8,6.23,5.69s-.09,6.07-1.93,8.43c-1.83,2.36-4.56,3.92-7.44,4.7-1.67.45-3.5.64-5.09-.04-2.34-1.01-3.61-4-2.69-6.38" fill="#2f2e43"/><g><path id="uuid-00bc58e7-734f-4d7c-a085-03c0cd267642-67" d="m375.76,309.2c-1.49,7.32,1.24,14.01,6.08,14.94s9.97-4.26,11.45-11.58c.63-2.92.53-5.94-.29-8.82l18.43-114.75-23.05-4.34-8.9,116.5c-1.89,2.36-3.16,5.12-3.72,8.06h0Z" fill="#9f616a"/><path d="m424.48,124.85h-15.73c-11.12,1.69-14.14,7.62-16.67,18.58-3.86,16.72-8.79,38.98-7.81,39.31,1.57.52,28.35,13.12,42,10.24l-1.79-68.13h0Z" fill="#e2e3e4"/></g><rect x="418.75" y="490.36" width="20.94" height="29.71" fill="#9f616a"/><path d="m398.36,538.05c-2.2,0-4.16-.05-5.64-.19-5.56-.51-10.87-4.62-13.54-7.02-1.2-1.08-1.58-2.8-.96-4.28h0c.45-1.06,1.34-1.86,2.45-2.17l14.7-4.2,23.8-16.06.27.48c.1.18,2.44,4.39,3.22,7.23.3,1.08.22,1.98-.23,2.68-.31.48-.75.76-1.1.92.43.45,1.78,1.37,5.94,2.03,6.07.96,7.35-5.33,7.4-5.59l.04-.21.18-.12c2.89-1.86,4.67-2.71,5.28-2.53.38.11,1.02.31,2.75,17.44.17.54,1.38,4.48.56,8.25-.89,4.1-18.81,2.69-22.4,2.37-.1.01-13.52.97-22.71.97h0Z" fill="#2f2e43"/><rect x="487.82" y="470.31" width="20.94" height="29.71" transform="translate(-181.25 337.18) rotate(-31.95)" fill="#9f616a"/><path d="m475.72,533.98c-2.46,0-4.72-.3-6.33-.58-1.58-.28-2.82-1.54-3.08-3.12h0c-.18-1.14.15-2.29.93-3.14l10.25-11.34,11.7-26.22.48.26c.18.1,4.39,2.43,6.56,4.43.83.76,1.24,1.57,1.22,2.4-.01.58-.23,1.04-.45,1.37.6.16,2.23.22,6.11-1.42,5.66-2.39,3.42-8.41,3.32-8.66l-.08-.2.09-.19c1.47-3.11,2.52-4.77,3.14-4.94.39-.11,1.03-.28,11.56,13.35.43.36,3.54,3.07,4.84,6.7,1.41,3.95-14.54,12.24-17.75,13.86-.1.08-16.79,12.21-23.65,15.66-2.72,1.37-5.94,1.79-8.87,1.79h0Z" fill="#2f2e43"/><path d="m455.11,241.91h-58.63l-5.32,54.54,23.28,201.52h29.93l-11.97-116.39,48.55,105.08,26.6-18.62-37.91-98.1s13.54-85.46,2.9-106.75c-10.64-21.28-17.43-21.28-17.43-21.28h0Z" fill="#2f2e43"/><polygon points="484.28 245.23 391.16 245.23 419.1 124.85 459.67 124.85 484.28 245.23" fill="#e2e3e4"/><path id="uuid-ece83039-1aa0-468e-a846-e0cb6ecd6032-68" d="m492.66,309.2c1.49,7.32-1.24,14.01-6.08,14.94s-9.97-4.26-11.45-11.58c-.63-2.92-.53-5.94.29-8.82l-18.43-114.75,23.05-4.34,8.9,116.5c1.89,2.36,3.16,5.12,3.72,8.06h0Z" fill="#9f616a"/><path d="m443.94,124.85h15.73c11.12,1.69,14.14,7.62,16.67,18.58,3.86,16.72,8.79,38.98,7.81,39.31-1.57.52-28.35,13.12-42,10.24l1.79-68.13h0Z" fill="#e2e3e4"/></g></svg>
                  </span>
                </div>
              </div>
    
              <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                  <span className="mb-1.5 block font-medium">Account Setup</span>
                  <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Account Details for MIS/MI CM-TS
                  </h2>
                        <FormProvider {...form}>
                            <AccountSetupForm />
                        </FormProvider>
                    <div className="mb-5">
                       <button
                            disabled={!isValid}
                            style={{
                                cursor: !isValid ? "not-allowed" : "pointer",
                                marginTop: '10px'
                            }}
                            onClick={handleContinue}
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                            >Continue</button>
                    </div>
                    
                </div>
              </div>
            </div>
                    </div>
                    
            }
            <LoadBackdrop open={loading} />
        </>
    )
}