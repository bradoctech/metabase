(ns metabase.collections.models.collection-name-test
  (:require
   [clojure.test :refer :all]
   [metabase.collections.models.collection :as collection]
   [metabase.util.i18n :as i18n]
   [toucan2.core :as t2]))

(deftest ^:parallel collection-location-with-localized-name-test
  (testing "Collection helpers accept both ordinary names and deferred system names"
    (doseq [collection-name ["My collection" (i18n/deferred-tru "Trash") (i18n/deferred-tru "Library")]]
      (let [coll (t2/instance :model/Collection
                              {:id 1, :name collection-name, :location "/", :namespace nil})]
        (is (= "/1/" (collection/children-location coll)))
        (is (false? (collection/shared-tenant-collection? coll)))))))
