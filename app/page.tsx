'use client';

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import adivinanzasJSON from '../public/advininanzas.json'

type Adivinanza = {
  adivinanza: string;
  pista: string;
  animal: string;
  respuesta: string;
  peso: number;
  velocidad: number;
  altura: number;
  palabras: number;
  letras: number;
}

const Home = () => {

  const defaultAdivinanza : Adivinanza = {
    adivinanza: '',
    pista: '',
    animal: '',
    respuesta: '',
    peso: 0,
    velocidad: 0,
    altura: 0,
    palabras: 0,
    letras: 0,
  }

  const [ adivinanza, setAdivinanza ] = useState<Adivinanza>(defaultAdivinanza);

  useEffect(() => {
    chooseRandomAnswer();
  }, [])

  const chooseRandomAnswer = () => {
    const index = Math.random() * (adivinanzasJSON.length);
    let adivinanza = adivinanzasJSON?.at(index) || defaultAdivinanza;
    adivinanza = {
      ...adivinanza,
      respuesta: adivinanza.animal.toUpperCase().replaceAll(' ', ''),
      palabras: adivinanza?.animal?.split(' ')?.length,
      letras: adivinanza?.animal?.replaceAll(' ', '')?.length
    }
    setAdivinanza(adivinanza);
  }

  const handleValidAnswer = () => {
    
  }

  return (
    <div className="flex flex-wrap content-start min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full h-size-min pt-20 pb-16">
        <h1 className="text-6xl font-semibold text-center">
          Adivinanzas de la selva
        </h1>
      </header>
      <main className="w-full size-min">
        <div className="flex flex-wrap justify-center w-full">
          <p className="font-medium text-center mb-6 text-2xl w-1/2">
            { adivinanza.adivinanza }
          </p>
        </div>
        <p className="font-medium text-center text-xl">
          ¿Sabías qué?
        </p>
        <p className="font-medium text-center mb-6 text-l">
          { adivinanza.pista }
        </p>
        <div className="flex flex-wrap justify-center">
          <p className="font-medium text-center mb-10 text-l mx-8">
            Peso<br/>{ adivinanza.peso }kg
          </p>
          <p className="font-medium text-center mb-10 text-l mx-8">
            Velocidad<br/>{ adivinanza.velocidad }km/h
          </p>
          <p className="font-medium text-center mb-10 text-l mx-8">
            Altura<br/>{ adivinanza.peso }m
          </p>
        </div>
        <Inputs handleValidAnswer={handleValidAnswer} adivinanza={adivinanza}></Inputs>
        <p className="font-medium text-center mt-6 text-l">
        ({ adivinanza.palabras } palabra{ adivinanza.palabras > 1 ? 's' : '' }) ({ adivinanza.letras } letras)
        </p>
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

  const moveFocusBack = (inputIndex: number) => {
    const prevChar = adivinanza?.animal?.at(inputIndex - 1) || '';
    setCurrentInputIndex(inputIndex - 1 < 0 ? 0 : prevChar === ' ' ? inputIndex - 2 : inputIndex - 1);
  }

  const handleChange = (inputIndex: number, value: string) => {
    userAnswerArr[inputIndex] = value;
    setUserAnswerArr(JSON.parse(JSON.stringify(userAnswerArr)));
    const prevChar = adivinanza?.animal?.at(inputIndex - 1) || '';
    const nextChar = adivinanza?.animal?.at(inputIndex + 1) || '';
    if (value === '' && inputIndex - 1 < 0) {
      return;
    }
    setCurrentInputIndex(inputIndex + (value === '' ? prevChar === ' ' ? -2 : -1 : nextChar === ' ' ? 2 : 1));
    const fullAnswer = userAnswerArr.join('');
    if (fullAnswer.length === adivinanza.respuesta.length) {
      if (fullAnswer === adivinanza.respuesta) {
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
        [ ...Array(adivinanza.animal.length).keys() ].map((i) => (
          adivinanza?.animal?.at(i) === ' '
            ? <span key={i} className='mx-3'></span>
            : <Input
              key={i}
              inputIndex={i}
              changeHandler={handleChange}
              moveFocusBack={moveFocusBack}
              value={userAnswerArr.at(i) || ''}
              focused={i === currentInputIndex}
              invalidAnswer={invalidAnswer}
            >
            </Input>
        ))
      }
    </div>
  )
}

type InputProps = {
  inputIndex: number;
  value: string;
  changeHandler: (inputIndex: number, value: string) => void;
  moveFocusBack: (inputIndex: number) => void;
  focused: boolean;
  invalidAnswer: boolean;
};

const Input = ({ inputIndex, value, changeHandler, moveFocusBack, focused, invalidAnswer }: InputProps) => {

  const [ text, setText ] = useState('');

  const ref = useRef<HTMLInputElement | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event?.target || '';
    value = (text?.length === 1 ? value?.at(-1) : value)?.toUpperCase() || ''
    changeHandler(inputIndex, value);
  }

  const handleKeyDown = (event : KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (text === '' && key.toLowerCase() === 'backspace') {
      moveFocusBack(inputIndex);
    }
  }

  useEffect(() => {
    setText(value || '');
  }, [ value ])

  useEffect(() => {
    ref.current?.blur()
    if (focused) {
      ref.current?.focus();
      setTimeout(() => {
        if (focused) {
          ref.current?.select();
        }
      }, 50);
    }
  }, [ focused ])

  return (
    <input
      type="text"
      className="outline-0"
      ref={ref}
      value={text}
      style={{ width: '14px', textAlign: 'center', color: invalidAnswer ? 'red' : '#000' }}
      max-length="1"
      placeholder="_"
      disabled={invalidAnswer}
      onChange={(e) => handleChange(e)}
      onKeyDown={(e) => handleKeyDown(e)}
    >
    </input>
  )

}

export default Home