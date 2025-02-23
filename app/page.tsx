'use client';

import { useState, useEffect, useRef } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import adivinanzasJSON from '../public/advininanzas.json'

type Adivinanza = {
  adivinanza: string;
  animal: string;
}

const Home = () => {

  const [ adivinanza, setAdivinanza ] = useState<Adivinanza>({ adivinanza: '', animal: '' });

  const [ showExplosion, setShowExplosion ] = useState<boolean>(false);

  useEffect(() => {
    chooseRandomAnswer();
  }, [])

  const chooseRandomAnswer = () => {
    const index = Math.random() * (adivinanzasJSON.length);
    const adivinanza = adivinanzasJSON?.at(index) || {
      adivinanza: '¿Cuál es el animal que es dos veces animal?',
      animal: 'Tu hermana'
    }
    setAdivinanza({
      ...adivinanza,
      animal: adivinanza.animal.toUpperCase()
    })
  }

  const handleValidAnswer = () => {
    setShowExplosion(true);
  }

  return (
    <div className="flex flex-wrap content-start min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      { showExplosion && <ConfettiExplosion /> }
      <header className="w-full h-size-min py-20">
        <h1 className="text-6xl font-semibold text-center">
          Adivinanzas de la selva
        </h1>
      </header>
      <main className="w-full size-min">
        <p className="font-medium text-center mb-10 text-xl">
          { adivinanza.adivinanza }
        </p>
        <p className="font-medium text-center mb-2 text-l">
          ¿Qué es?
        </p>
        <Inputs handleValidAnswer={handleValidAnswer} adivinanza={adivinanza}></Inputs>
      </main>
    </div>
  );
}

type InputsProps = {
  handleValidAnswer: () => void;
  adivinanza: Adivinanza;
};

const Inputs = ({ handleValidAnswer, adivinanza }: InputsProps) => {
  
  const [ userAnswerArr, setUserAnswerArr ] = useState<string[]>([]);

  const [ currentInputIndex, setCurrentInputIndex ] = useState<number>(0);

  const [ invalidAnswer, setInvalidAnswer ] = useState<boolean>(false);

  const handleChange = (inputIndex: number, value: string) => {
    userAnswerArr[inputIndex] = value;
    setUserAnswerArr(JSON.parse(JSON.stringify(userAnswerArr)));
    setCurrentInputIndex(inputIndex + (value === '' ? - 1 : 1));
    const fullAnswer = userAnswerArr.join('');
    if (fullAnswer.length === adivinanza.animal.length) {
      if (fullAnswer === adivinanza.animal) {
        handleValidAnswer();
      } else {
        setInvalidAnswerAndReset();
      }
    }
  }

  const setInvalidAnswerAndReset = () => {
    setInvalidAnswer(true);
    setTimeout(() => {
      setInvalidAnswer(false);
      setUserAnswerArr([]);
      setCurrentInputIndex(0);
    }, 500);
  }

  return (
    <div className="flex justify-center">
      {
        [ ...Array(adivinanza.animal.length).keys() ].map((i) => <Input key={i} inputIndex={i} changeHandler={handleChange} value={userAnswerArr.at(i) || ''} focused={i === currentInputIndex} invalidAnswer={invalidAnswer}></Input> )
      }
    </div>
  )
}

type EventTarget<T> = {
  target: {
    value: T
  }
}

type InputProps = {
  inputIndex: number;
  value: string;
  changeHandler: (inputIndex: number, value: string) => void;
  focused: boolean;
  invalidAnswer: boolean;
};

const Input = ({ inputIndex, value, changeHandler, focused, invalidAnswer }: InputProps) => {

  const [ text, setText ] = useState('');

  const ref = useRef<HTMLInputElement | null>(null)

  const handleChange = (event: EventTarget<string | undefined>) => {
    let { value } = event.target;
    value = (text?.length === 1 ? value?.at(-1) : value)?.toUpperCase() || ''
    changeHandler(inputIndex, value);
  }

  useEffect(() => {
    setText(value || '');
  }, [ value ])

  useEffect(() => {
    ref.current?.blur()
    if (focused) {
      ref.current?.focus();
    }
  }, [ focused ])

  return (
    <input type="text" className="outline-0" ref={ref} value={text} style={{ width: '14px', textAlign: 'center', color: invalidAnswer ? 'red' : '#000' }} max-length="1" placeholder="-" disabled={invalidAnswer} onChange={handleChange}></input>
  )

}

export default Home