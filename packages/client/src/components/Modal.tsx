import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { trpc } from "../utils/trpc";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
};

export const Modal = ({ isOpen, onClose, bookId }: Props) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Book Detail
                      </Dialog.Title>
                      <div className="mt-2">
                        <Body bookId={bookId} />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const Body = (props: { bookId: string }) => {
  const bookInfoQuery = trpc.getBookInfoWithAuthorDetail.useQuery(props.bookId);
  if (!bookInfoQuery.data) {
    return <div>Loading...</div>;
  }
  const data = bookInfoQuery.data;
  const { book, authorInfo } = data;
  const { title, description, imageLinks } = book.volumeInfo;
  const { thumbnail } = imageLinks || {};
  const { name, image, detailedDescription } = authorInfo || {};
  const { articleBody } = detailedDescription || {};
  const { contentUrl } = image || {};
  return (
    <div className="flex flex-col items-center">
      {thumbnail && (
        <img src={thumbnail} alt={title} className="w-48 h-64 object-contain" />
      )}
      <h2 className="text-2xl font-bold my-4">{title}</h2>
      <p className="text-lg">{description}</p>
      <div className="my-4 flex flex-col items-center">
        {contentUrl && (
          <img
            src={contentUrl}
            alt={name}
            className="w-48 h-64 object-contain"
          />
        )}
        <h3 className="text-xl font-bold">Author: {name}</h3>
        <p className="text-lg">{articleBody}</p>
      </div>
    </div>
  );
};
