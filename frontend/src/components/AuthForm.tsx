import React from 'react';
import { AppCtx, GlobalContext } from '../App';
import "./AuthForm.css";
import OpenwareLogoSmall from '../img/logo-openware-small.svg';

export enum Pages {
  Signup = 1,
  Registered,
  Signin
}

export default function AuthForm() {
  const [card, setCard] = React.useState<Pages>(Pages.Signup);
  const appctx = React.useContext(AppCtx);

  function getCard() {
    switch (card) {
      case Pages.Signup:
        return <SignUpCard setCard={setCard} appCtx={appctx} />
      case Pages.Registered:
        return <SingInCard setCard={setCard} appCtx={appctx} reg={true} />
      case Pages.Signin:
      default:
        return <SingInCard setCard={setCard} appCtx={appctx} reg={false}/>
    }
  }

  return (
    <div className={'background'}>
      <div className={'dino'}>
        {getCard()}
      </div>
    </div>
  )
}

export type CardProps = {
  setCard?: React.Dispatch<React.SetStateAction<Pages>>, 
  appCtx?: GlobalContext | undefined | null, 
  reg?: boolean
}

function SingInCard({setCard, appCtx, reg}: CardProps) {
  const [noAccount, setNoAccount] = React.useState(false);
  const [invalidPassword, setInvalidPassword] = React.useState(false);
  const emailRef = React.useRef<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>(null);
  const passRef = React.useRef<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>(null);

  async function dispatchSignin() {
    const email = emailRef.current?.value || '';
    const password = passRef.current?.value || '';

    const response = await fetch('/user/signin', {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({email, password})
    }).then(data => data.text());

    switch (response) {
      case 'could not read params':
        break;
      case 'no such user':
        setNoAccount(true);
        break;
      case 'invalid password':
        setInvalidPassword(true);
        break;
      default:
        if (appCtx !== null && appCtx !== undefined) {
          appCtx.setUserEmail(email as string);
          appCtx.setJwtToken(String(response) as string);
        }
        break;
    }
  }

  return (
    <div className={'card'}>
      <div className={'flex flex-col'}>
        <div className={'flex flex-row'}>
          <img src={OpenwareLogoSmall} alt={"Openware"} className={'pr-1.5'}/>
          <span className={'font-sans font-medium text-2xl text-gray-500'}>Todo</span>
        </div>
        <span className={'pt-1.5 pb-3 font-sans font-medium text-lg'}>Sign in</span>
        {noAccount ?
          <span className={'text-red-500'}>We couldn't find an account with that username. 
            Try another, or <span onClick={() => setCard(Pages.Signup)} className={'text-yellow-300 underline cursor-pointer'}>get a new account.</span>
          </span> : null
        }
        {invalidPassword ? <span className={'text-red-500'}>Your password is incorrect</span> : null}
        {reg ? <span className={'text-green-500'}>Successfuly registered. Now sign in</span> : null}

        <input ref={emailRef} type={"email"} className={'mb-2 pb-0.5'} placeholder={'Email'} onClick={() => {setNoAccount(false); setInvalidPassword(false)}} />
        <input ref={passRef} type={"password"} className={'mb-4 pb-0.5'} placeholder={'Password'} onClick={() => {setNoAccount(false); setInvalidPassword(false)}} />

        <span className={'text-sm'}>No account? <button onClick={() => setCard(Pages.Signup)} className={'text-yellow-300 underline cursor-pointer'}>Create one!</button></span>
        <span className={'text-sm'}>Forgot password?</span>
      </div>
      
      <div className={'flex flex-row-reverse'}>
        <button className={'btn'} onClick={dispatchSignin} type={'button'}>Sign in</button>
      </div>
    </div>
  )
}

function SignUpCard({setCard, appCtx}: CardProps) {
  const emailRef = React.useRef<React.InputHTMLAttributes<HTMLInputElement | null>>(null);
  const passRef = React.useRef<React.InputHTMLAttributes<HTMLInputElement | null>>(null);
  const confirmPassRef = React.useRef(null);

  const [alreadyRegistered, setAlreadyRegistered] = React.useState(false);

  async function dispatchSignup() {
    const email = emailRef.current.value;
    const password = passRef.current.value;

    const response = await fetch('/user/signup', {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({email, password})
    }).then(response => response.text());

    switch (response) {
      case 'could not read params':
        break;
      case 'user is already registered':
        setAlreadyRegistered(true);
        break;
      default:
        setCard(Pages.Registered);
        break;
    }
  }

  return (
    <div className={'card'}>
      <div className={'flex flex-col'}>
        <div className={'flex flex-row'}>
          <img src={OpenwareLogoSmall} alt={"Openware"} className={'pr-1.5'}/>
          <span className={'font-sans font-medium text-2xl text-gray-500'}>Todo</span>
        </div>
        <span className={'pt-1.5 pb-3 font-sans font-medium text-lg'}>Sign up</span>
        {alreadyRegistered ? <span className={'text-red-500'}>This email is already registered</span> : null}

        <input ref={emailRef} onClick={() => setAlreadyRegistered(false)} type={"email"} className={'mb-2 pb-0.5'} placeholder={'Email'} />
        <input ref={passRef} type={"password"} className={'mb-2 pb-0.5'} placeholder={'Password'} />
        <input ref={confirmPassRef} type={"password"} className={'mb-4 pb-0.5'} placeholder={'Confirm password'} />
      </div>
      
      <div className={'flex flex-row-reverse'}>
        <button className={'btn'} onClick={dispatchSignup} type={'button'}>Sign up</button>
        <button className={'btn mr-4'} style={{backgroundColor: '#B8B8B8'}} onClick={() => setCard(Pages.Signin)} type={'button'}>Back</button>
      </div>
    </div>
  )
}