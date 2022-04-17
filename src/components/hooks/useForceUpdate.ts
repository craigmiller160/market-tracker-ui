import { useState } from 'react';

export const useForceUpdate = () => useState<object>()[1].bind(null, {});
