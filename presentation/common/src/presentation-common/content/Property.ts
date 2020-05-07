/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Content
 */

import { PropertyInfo, PropertyInfoJSON, RelatedClassInfo, RelationshipPath, RelationshipPathJSON } from "../EC";

/**
 * Data structure that describes one step of property
 * accessor path.
 *
 * @public
 */
export interface PropertyAccessor {
  /** Name of ECProperty */
  propertyName: string;
  /** If the property is an array, array index. Otherwise undefined. */
  arrayIndex?: number;
}

/**
 * Describes path to a property.
 * @public
 */
export type PropertyAccessorPath = PropertyAccessor[];

/**
 * Data structure that describes a single ECProperty that's
 * included in a [[PropertiesField]].
 *
 * @public
 */
export interface Property {
  /** ECProperty information */
  property: PropertyInfo;
  /**
   * Relationship path from [Primary instance]($docs/learning/presentation/Content/Terminology#primary-instance) to
   * this property. This array is not empty only for [Related properties]($docs/learning/presentation/Content/Terminology#related-properties).
   */
  relatedClassPath: RelationshipPath;
}

/** @public */
export namespace Property {
  /** Serialize [[Property]] to JSON */
  export function toJSON(prop: Property): PropertyJSON {
    return {
      property: PropertyInfo.toJSON(prop.property),
      relatedClassPath: prop.relatedClassPath.map((rci) => RelatedClassInfo.toJSON(rci)),
    };
  }

  /** Deserializes [[Property]] from JSON */
  export function fromJSON(json: PropertyJSON): Property {
    return {
      property: PropertyInfo.fromJSON(json.property),
      relatedClassPath: json.relatedClassPath.map((p) => RelatedClassInfo.fromJSON(p)),
    };
  }
}

/**
 * JSON representation of [[Property]]
 * @public
 */
export interface PropertyJSON {
  property: PropertyInfoJSON;
  relatedClassPath: RelationshipPathJSON;
}