import React, { useState } from 'react';
import { TimeSplit } from './typings/global';
import { tick } from './utils/time';
import { useCssHandles } from "vtex.css-handles";
import { useQuery } from 'react-apollo';
import useProduct from 'vtex.product-context/useProduct';
import productReleaseDate from './queries/productReleaseDate.graphql';

interface CountdownProps { 
  targetDate: string
}

const CSS_HANDLES = ["countdown"];

const DEFAULT_TARGET_DATE = (new Date('2020-08-20')).toISOString();

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({
  targetDate = DEFAULT_TARGET_DATE,
}) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const { product: { linkText } } = useProduct()
  const { data, loading, error } = useQuery(productReleaseDate, {
  variables: {
    slug: linkText
  },
   ssr: false
 })

 console.log({data})

 if (loading) {
  return (
    <div>
      <span>Loading...</span>
    </div>
  )
}
if (error) {
  return (
    <div>
      <span>Error!</span>
    </div>
  )
}

  const handles = useCssHandles(CSS_HANDLES);

  tick(data?.product?.releaseDate || targetDate, setTime);

  return (
    <div className={`${handles.countdown} db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  );
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
        title: 'Final date',
        description: 'Final date used in the countdown',
        type: 'string',
        default: null,
      },
  }
}
export default Countdown
