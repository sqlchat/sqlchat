import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowUturnLeftIcon, Bars3Icon, Cog6ToothIcon, XMarkIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import SettingGeneralView from "../../components/SettingGeneralView";
import StripeCheckPaymentBanner from "../../components/StripeCheckPaymentBanner";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SettingPage: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: t("common.back"),
      href: "/",
      icon: ArrowUturnLeftIcon,
      current: false,
    },
    {
      name: t("setting.general"),
      href: "/setting",
      icon: Cog6ToothIcon,
      current: true,
    },
  ];

  return (
    <>
      <Head>
        <title>{t("setting.self")}</title>
      </Head>

      <div className="dark:bg-zinc-800">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-zinc-800 px-6 pb-2">
                    <Link className="flex pt-4 shrink-0 items-center" href="/">
                      <img className="w-auto" src="/chat-logo.webp" alt="" />
                    </Link>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.current ? "bg-gray-50 text-indigo-600" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-6">
            <Link className="flex pt-4 shrink-0 items-center" href="/">
              <img className="" src="/chat-logo.webp" alt="" />
            </Link>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 !text-indigo-600 dark:bg-zinc-800"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-zinc-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold dark:text-gray-400"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? "!text-indigo-600" : "text-gray-400 group-hover:text-indigo-600",
                              "h-6 w-6 shrink-0 dark:text-gray-400"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white dark:bg-zinc-700 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="lg:pl-72">
          {router.query.session_id && <StripeCheckPaymentBanner sessionId={router.query.session_id as string} />}
          <div className="px-4 sm:px-6 lg:px-8 dark:bg-zinc-800">
            <SettingGeneralView />
          </div>
        </main>
      </div>
    </>
  );
};

export default SettingPage;
