import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../src/services/AjaxApi';
import {AsymmetricRequestDataMatcher} from './axiosMockAdapterTypes';



const mockApiInstance = new MockAdapter(ajaxApi.instance);

type RequestMatcher = {
	readonly matcher?: string | RegExp;
	readonly body?: string | AsymmetricRequestDataMatcher;
};

mockApiInstance.onGet();
