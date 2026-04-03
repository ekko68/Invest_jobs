import React, {forwardRef} from 'react';
import {FormatUtils, StringUtils} from "modules/utils/StringUtils";
import {isNumber, limitNumberSet} from "modules/utils/NumberUtils";

export const NumInput = (props) => {

    const {
        defaultData = null,
        setState = null,
        isPositiveNum = true,
        isCommaFormat = true,
        focusZeroToBlank = true,
        ...filteredProps
    } = props;

    const commaFormat = FormatUtils.numberWithCommas;
    const REGEX = {
        ONLY_POSITIVE: /[^.0-9]/g,
        NUMBER: /[^-.0-9]/g,
    }

    const onFocus = event => {
        event.target.value = event.target.value.replace(REGEX.NUMBER, '');
        if (focusZeroToBlank && event.target.value == 0) event.target.value = '';
    }

    const onChange = event => {
        const reValue = isPositiveNum
            ? event.target.value.replace(REGEX.ONLY_POSITIVE, '')
            : event.target.value.replace(REGEX.NUMBER, '');

        event.target.value =
            (!StringUtils.hasLength(reValue) || reValue === '-')
                ? reValue
                : isNumber(reValue)
                    ? limitNumberSet(reValue) : 0;


        if (setState && reValue != '-') setState(Number(event.target.value));
    }

    const onBlur = event => {
        if (isNumber(event.target.value)) {
            if (isCommaFormat) event.target.value = commaFormat.format(event.target.value);
        } else if (isNumber(defaultData)) {
            event.target.value = isCommaFormat ? commaFormat.format(defaultData) : defaultData;
            if (setState) setState(defaultData);
        }
    }

    return (
        <input {...filteredProps}
               onBlur={onBlur}
               onFocus={onFocus}
               onChange={onChange}
        />
    )
}


/**
 * ref 를 통해 reset update를 처리할 수 있게 하기 위해 forwardRef 사용
 * @param {Number} props.defaultData
 * @param {function} props.setState
 * @param {boolean} props.isPositiveNum
 * @param {boolean} props.isPositiveNum
 * @param {boolean} props.focusZeroToBlank
 * @returns {JSX.Element}
 */
export const NumInputRef = forwardRef((props, ref) => {

    const {
        defaultData = null,
        setState = null,
        isPositiveNum = true,
        isCommaFormat = true,
        focusZeroToBlank = true,
        ...filteredProps
    } = props;

    // NumInput과 중복되지만 class 등을 사용해 공급하기에는
    // 컴포넌트 생성 주기상 인스턴스 생성주기가 불필하게 생기므로 동일 코드 사용

    const commaFormat = FormatUtils.numberWithCommas;
    const REGEX = {
        ONLY_POSITIVE: /[^.0-9]/g,
        NUMBER: /[^-.0-9]/g,
    }

    const onFocus = event => {
        if (focusZeroToBlank && event.target.value == 0) event.target.value = '';
    }

    const onChange = event => {
        const reValue = isPositiveNum
            ? event.target.value.replace(REGEX.ONLY_POSITIVE, '')
            : event.target.value.replace(REGEX.NUMBER, '');

        event.target.value =
            (!StringUtils.hasLength(reValue) || reValue === '-')
                ? reValue
                : isNumber(reValue)
                    ? limitNumberSet(reValue) : 0;


        if (setState && reValue != '-') setState(Number(event.target.value));
    }

    const onBlur = event => {
        if (isNumber(event.target.value)) {
            if (isCommaFormat) event.target.value = commaFormat.format(event.target.value);
        } else if (isNumber(defaultData)) {
            event.target.value = isCommaFormat ? commaFormat.format(defaultData) : defaultData;
            if (setState) setState(defaultData);
        }
    }

    return (
        <input {...filteredProps}
               onBlur={onBlur}
               onFocus={onFocus}
               onChange={onChange}
               ref={ref}
        />
    )
});