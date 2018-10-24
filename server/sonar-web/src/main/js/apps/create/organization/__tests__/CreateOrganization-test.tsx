/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import { times } from 'lodash';
import { Location } from 'history';
import { shallow } from 'enzyme';
import { CreateOrganization } from '../CreateOrganization';
import { mockRouter, waitAndUpdate } from '../../../../helpers/testUtils';
import { LoggedInUser } from '../../../../app/types';
import {
  getAlmAppInfo,
  getAlmOrganization,
  listUnboundApplications
} from '../../../../api/alm-integration';
import { getSubscriptionPlans } from '../../../../api/billing';
import { getOrganizations } from '../../../../api/organizations';

jest.mock('../../../../api/billing', () => ({
  getSubscriptionPlans: jest
    .fn()
    .mockResolvedValue([{ maxNcloc: 100000, price: 10 }, { maxNcloc: 250000, price: 75 }])
}));

jest.mock('../../../../api/alm-integration', () => ({
  getAlmAppInfo: jest.fn().mockResolvedValue({
    application: {
      backgroundColor: 'blue',
      iconPath: 'icon/path',
      installationUrl: 'https://alm.installation.url',
      key: 'github',
      name: 'GitHub'
    }
  }),
  getAlmOrganization: jest.fn().mockResolvedValue({
    avatar: 'my-avatar',
    description: 'Continuous Code Quality',
    key: 'sonarsource',
    name: 'SonarSource',
    personal: false,
    url: 'https://www.sonarsource.com'
  }),
  listUnboundApplications: jest.fn().mockResolvedValue({ applications: [] })
}));

jest.mock('../../../../api/organizations', () => ({
  getOrganizations: jest.fn().mockResolvedValue({ organizations: [] })
}));

const user: LoggedInUser = {
  groups: [],
  isLoggedIn: true,
  login: 'luke',
  name: 'Skywalker',
  scmAccounts: [],
  showOnboardingTutorial: false
};

beforeEach(() => {
  (getAlmAppInfo as jest.Mock<any>).mockClear();
  (getAlmOrganization as jest.Mock<any>).mockClear();
  (listUnboundApplications as jest.Mock<any>).mockClear();
  (getSubscriptionPlans as jest.Mock<any>).mockClear();
  (getOrganizations as jest.Mock<any>).mockClear();
});

it('should render with manual tab displayed', async () => {
  const wrapper = shallowRender();
  await waitAndUpdate(wrapper);
  expect(wrapper).toMatchSnapshot();
  expect(getSubscriptionPlans).toHaveBeenCalled();
  expect(getAlmAppInfo).not.toHaveBeenCalled();
});

it('should preselect paid plan on manual creation', async () => {
  const location = { state: { paid: true } };
  // @ts-ignore avoid passing everything from WithRouterProps
  const wrapper = shallowRender({ location });
  await waitAndUpdate(wrapper);
  expect(wrapper.find('ManualOrganizationCreate').prop('onlyPaid')).toBe(true);
});

it('should render with auto tab displayed', async () => {
  const wrapper = shallowRender({ currentUser: { ...user, externalProvider: 'github' } });
  await waitAndUpdate(wrapper);
  expect(wrapper).toMatchSnapshot();
  expect(getAlmAppInfo).toHaveBeenCalled();
  expect(listUnboundApplications).toHaveBeenCalled();
});

it('should render with auto tab selected and manual disabled', async () => {
  const wrapper = shallowRender({
    currentUser: { ...user, externalProvider: 'github' },
    location: { query: { installation_id: 'foo' } } as Location // eslint-disable-line camelcase
  });
  expect(wrapper).toMatchSnapshot();
  await waitAndUpdate(wrapper);
  expect(wrapper).toMatchSnapshot();
  expect(getAlmAppInfo).toHaveBeenCalled();
  expect(getAlmOrganization).toHaveBeenCalled();
  expect(getOrganizations).toHaveBeenCalled();
});

it('should render with auto personal organization bind page', async () => {
  (getAlmOrganization as jest.Mock<any>).mockResolvedValueOnce({
    key: 'foo',
    name: 'Foo',
    avatar: 'my-avatar',
    personal: true
  });
  const wrapper = shallowRender({
    currentUser: { ...user, externalProvider: 'github', personalOrganization: 'foo' },
    location: { query: { installation_id: 'foo' } } as Location // eslint-disable-line camelcase
  });
  expect(wrapper).toMatchSnapshot();
  await waitAndUpdate(wrapper);
  expect(wrapper).toMatchSnapshot();
});

it('should slugify and find a uniq organization key', async () => {
  (getAlmOrganization as jest.Mock<any>).mockResolvedValueOnce({
    avatar: 'https://avatars3.githubusercontent.com/u/37629810?v=4',
    key: 'Foo&Bar',
    name: 'Foo & Bar',
    personal: true
  });
  (getOrganizations as jest.Mock<any>).mockResolvedValueOnce({
    organizations: [{ key: 'foo-and-bar' }, { key: 'foo-and-bar-1' }]
  });
  const wrapper = shallowRender({
    currentUser: { ...user, externalProvider: 'github' },
    location: { query: { installation_id: 'foo' } } as Location // eslint-disable-line camelcase
  });
  await waitAndUpdate(wrapper);
  expect(getOrganizations).toHaveBeenCalledWith({
    organizations: ['foo-and-bar', ...times(9, i => `foo-and-bar-${i + 1}`)].join(',')
  });
  expect(wrapper.find('AutoOrganizationCreate').prop('almOrganization')).toMatchObject({
    key: 'foo-and-bar-2'
  });
});

it('should switch tabs', async () => {
  const replace = jest.fn();
  const wrapper = shallowRender({
    currentUser: { ...user, externalProvider: 'github' },
    router: mockRouter({ replace })
  });

  replace.mockImplementation(location => {
    wrapper.setProps({ location }).update();
  });

  await waitAndUpdate(wrapper);
  expect(wrapper).toMatchSnapshot();

  (wrapper.find('Tabs').prop('onChange') as Function)('manual');
  expect(wrapper.find('ManualOrganizationCreate').exists()).toBeTruthy();
  (wrapper.find('Tabs').prop('onChange') as Function)('auto');
  expect(wrapper.find('AutoOrganizationCreate').exists()).toBeTruthy();
});

it('should reload the alm organization when the url query changes', async () => {
  const wrapper = shallowRender({ currentUser: { ...user, externalProvider: 'github' } });
  await waitAndUpdate(wrapper);
  expect(getAlmOrganization).not.toHaveBeenCalled();
  wrapper.setProps({ location: { query: { installation_id: 'foo' } } }); // eslint-disable-line camelcase
  expect(getAlmOrganization).toHaveBeenCalledWith({ installationId: 'foo' });
  wrapper.setProps({ location: { query: {} } });
  expect(wrapper.state('almOrganization')).toBeUndefined();
  expect(listUnboundApplications).toHaveBeenCalledTimes(2);
});

function shallowRender(props: Partial<CreateOrganization['props']> = {}) {
  return shallow(
    <CreateOrganization
      currentUser={user}
      {...props}
      // @ts-ignore avoid passing everything from WithRouterProps
      location={{}}
      router={mockRouter()}
      userOrganizations={[
        { key: 'foo', name: 'Foo' },
        { alm: { key: 'github', url: '' }, key: 'bar', name: 'Bar' }
      ]}
      {...props}
    />
  );
}