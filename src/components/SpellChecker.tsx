"use client"

import PayloadResponses from "@/types/PayloadResponses";
import axios, { AxiosResponse } from "axios";
import { ChangeEvent, LegacyRef, MouseEvent, useRef, useState } from "react"
import SpellFault from "./SpellFault";

interface PayloadReq {
    sentence: String | undefined,
    lang: string
}

enum LangReq { fr = "fr", en = "en" }
enum RequestState { loading, fetched, unused, error }

/**
 * 
 * @returns React element for the "spell checker"
 */
export default function SpellChecker() {
    const inputElement = useRef<HTMLInputElement>(null);
    const [requestState, setState] = useState<RequestState>(RequestState.unused)
    const [lang, setLang] = useState<LangReq>(LangReq.fr)

    /**
     * Function to handle the verification of the sentence and its suggestions
     */
    async function verifySentence() {
        var listWords: String | undefined;
        listWords = inputElement.current?.textContent?.toString();
        if (typeof listWords === undefined) {
            console.error("Input not found")
        } else {
            var reqPayload: PayloadReq = {
                sentence: listWords,
                lang: lang
            }
            setState(RequestState.loading)
            await axios.post<PayloadReq, AxiosResponse<PayloadResponses>>("http://localhost:8080/", reqPayload)
                .then(
                    (value) => {
                        setState(RequestState.fetched)
                        value.data["to-be-suggested"].forEach(
                            e => {
                                console.log(e)
                                changeWordToSpan(e)
                            }
                        )
                    }
                )
                .catch(
                    e => {
                        setState(RequestState.error)
                        console.error(e)
                    }
                )
        }
    }

    /**
     * Underlined all the words that need to be changed
     * @param word 
     */
    function changeWordToSpan(word: string) {
        var spanElement = document.createElement("span"),
            inputReference = inputElement.current as HTMLInputElement,
            inputElementValue = inputReference.innerHTML;

        spanElement.classList.add("red-flag");
        spanElement.innerHTML = word;

        let replacedValue = inputElementValue?.replace(word, spanElement.outerHTML);
        inputReference.innerHTML = replacedValue;
    }

    /**
     * Handle the langage change
     * @param e 
     */
    function changeLanguage(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.id === LangReq.fr) setLang(LangReq.fr)
        else setLang(LangReq.en)
    }

    /**
     * Loader after the initialization of the verification
     * @returns 
     */
    function loader() {
        if (requestState === RequestState.loading)
            return <>Loading ...</>
        else if (requestState === RequestState.error) {
            return <>There is an error</>
        }
        else {
            return <></>
        }
    }

    return (<>
        <div className="flex items-start w-5/6">
            <label className="mx-2 group">
                <input type="radio" name="lang" id="fr" checked={lang === LangReq.fr} onChange={changeLanguage} />Français
            </label>
            <label className="mx-2">
                <input type="radio" name="lang" id="en" checked={lang === LangReq.en} onChange={changeLanguage} />Anglais
            </label>
        </div>
        <div className="w-5/6 h-[300px]">
            <div
                contentEditable={true}
                spellCheck={false}
                className="w-full h-full my-6 outline-none border-2 p-2 rounded-lg transition-all focus:border-blue-700"
                ref={inputElement}
            >
            </div>

        </div>
        <button onClick={verifySentence}>Vérifier</button>
        {loader()}
    </>)
}